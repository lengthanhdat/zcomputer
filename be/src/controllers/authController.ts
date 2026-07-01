import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { ROLE_PERMISSIONS } from '../middlewares/authorize';
import { OAuth2Client } from 'google-auth-library';
import { sendEmail } from '../utils/sendEmail';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be set in environment variables!');
}

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'customer'
    });

    const savedUser = await newUser.save();
    
    res.status(201).json({ message: 'Đăng ký thành công', userId: savedUser._id });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi đăng ký', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    if (user.status === 'locked') {
      return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.' });
    }

    const role = user.role;
    const permissions = ROLE_PERMISSIONS[role] || [];

    const accessToken = jwt.sign({ userId: user._id, role, permissions }, JWT_SECRET, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ userId: user._id, role }, JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: 'Đăng nhập thành công',
      token: accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role,
        permissions
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi đăng nhập', error });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: 'Không có Refresh Token' });
    }

    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(403).json({ message: 'User không tồn tại' });
    }

    if (user.status === 'locked') {
      return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa.' });
    }

    const role = user.role;
    const permissions = ROLE_PERMISSIONS[role] || [];

    const accessToken = jwt.sign({ userId: user._id, role, permissions }, JWT_SECRET, {
      expiresIn: '15m',
    });

    res.json({ token: accessToken });
  } catch (error) {
    res.status(403).json({ message: 'Refresh token không hợp lệ hoặc đã hết hạn' });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Đăng xuất thành công' });
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Thiếu Google credential token' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ message: 'Token không hợp lệ' });
    }

    const { email, name, picture } = payload;
    let user = await User.findOne({ email });

    if (!user) {
      // Đăng ký mới nếu user chưa tồn tại
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
      const newUser = new User({
        name,
        email,
        password: randomPassword,
        role: 'customer' // Mặc định role là customer
      });
      user = await newUser.save();
    }

    if (user.status === 'locked') {
      return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.' });
    }

    const role = user.role;
    const permissions = ROLE_PERMISSIONS[role] || [];

    const accessToken = jwt.sign({ userId: user._id, role, permissions }, JWT_SECRET, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ userId: user._id, role }, JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: 'Đăng nhập Google thành công',
      token: accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role,
        permissions
      }
    });
  } catch (error) {
    console.error("Lỗi Google Login:", error);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập bằng Google', error });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại trong hệ thống' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 40px 0;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6;">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin: 0 auto;">
                <!-- Header -->
                <tr>
                  <td align="center" style="background: linear-gradient(135deg, #e53935 0%, #b71c1c 100%); padding: 30px;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">ZComputer</h1>
                  </td>
                </tr>
                
                <!-- Body -->
                <tr>
                  <td style="padding: 40px 30px; color: #333333; line-height: 1.6; font-size: 16px;">
                    <p style="margin-top: 0;">Xin chào <strong style="color: #111;">${user.name}</strong>,</p>
                    <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã xác nhận (OTP) dưới đây để tiếp tục quá trình:</p>
                    
                    <!-- OTP Box -->
                    <div style="background-color: #f8f9fa; border: 2px dashed #e53935; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                      <div style="font-size: 32px; font-weight: bold; color: #e53935; letter-spacing: 8px;">${otp}</div>
                    </div>
                    
                    <p>Mã này có hiệu lực trong <strong style="color: #e53935;">10 phút</strong>. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này để bảo vệ tài khoản.</p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td align="center" style="background-color: #f8f9fa; padding: 20px 30px; font-size: 14px; color: #777777; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0 0 5px 0;">Cảm ơn bạn đã tin tưởng <strong style="color: #111;">ZComputer</strong>.</p>
                    <p style="margin: 0 0 5px 0;">Email: zcomputervn.cskh@gmail.com | Hotline: 0123 456 789</p>
                    <p style="margin: 0; font-size: 12px;">&copy; ${new Date().getFullYear()} ZComputer. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Không dùng await để ko làm treo request, nhưng với OTP có thể dùng await để chắc chắn mail đã gửi
    await sendEmail(email, 'Mã OTP Đặt Lại Mật Khẩu - ZComputer', emailContent);

    res.json({ message: 'Mã OTP đã được gửi đến email của bạn' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi yêu cầu quên mật khẩu' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Mã OTP không hợp lệ hoặc đã hết hạn' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Mật khẩu đã được cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi đặt lại mật khẩu' });
  }
};

