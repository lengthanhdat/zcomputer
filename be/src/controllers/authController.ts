import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { ROLE_PERMISSIONS } from '../middlewares/authorize';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'superrefreshkey123';

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
