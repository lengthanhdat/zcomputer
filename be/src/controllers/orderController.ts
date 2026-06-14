import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { sendEmail } from '../utils/sendEmail';


// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerInfo, items, totalAmount, paymentMethod } = req.body;
    
    if (items && items.length === 0) {
      return res.status(400).json({ message: 'Không có sản phẩm nào trong đơn hàng' });
    }

    const order = new Order({
      customerInfo,
      items,
      totalAmount,
      paymentMethod,
      user: req.user?.userId || null
    });

    const createdOrder = await order.save();

    // Gửi email xác nhận
    if (customerInfo?.email) {
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
                    <td align="center" style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); padding: 30px;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Cảm Ơn Bạn Đã Đặt Hàng!</h1>
                    </td>
                  </tr>
                  
                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px 30px; color: #333333; line-height: 1.6; font-size: 16px;">
                      <p style="margin-top: 0;">Xin chào <strong style="color: #111;">${customerInfo.name}</strong>,</p>
                      <p>Đơn hàng của bạn tại <strong style="color: #e53935;">ZComputer</strong> đã được ghi nhận thành công và đang được xử lý. Dưới đây là thông tin tóm tắt về đơn hàng:</p>
                      
                      <!-- Order Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="15" style="background-color: #f8f9fa; border-left: 4px solid #1e3a8a; border-radius: 4px; margin: 25px 0;">
                        <tr>
                          <td style="border-bottom: 1px dashed #e2e8f0; color: #64748b; font-weight: 500;">Mã đơn hàng</td>
                          <td align="right" style="border-bottom: 1px dashed #e2e8f0; font-weight: 700; color: #3b82f6;">#${createdOrder._id.toString().slice(-8).toUpperCase()}</td>
                        </tr>
                        <tr>
                          <td style="border-bottom: 1px dashed #e2e8f0; color: #64748b; font-weight: 500;">Tổng tiền</td>
                          <td align="right" style="border-bottom: 1px dashed #e2e8f0; font-weight: 700; color: #e53935; font-size: 18px;">${totalAmount.toLocaleString('vi-VN')} VNĐ</td>
                        </tr>
                        <tr>
                          <td style="color: #64748b; font-weight: 500;">Thanh toán</td>
                          <td align="right" style="font-weight: 700; color: #0f172a;">${paymentMethod === 'cod' ? 'Tiền mặt (COD)' : paymentMethod}</td>
                        </tr>
                      </table>
                      
                      <p>Chúng tôi sẽ sớm liên hệ qua số điện thoại <strong style="color: #111;">${customerInfo.phone}</strong> để xác nhận và thông báo thời gian giao hàng.</p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td align="center" style="background-color: #f8f9fa; padding: 20px 30px; font-size: 14px; color: #777777; border-top: 1px solid #eeeeee;">
                      <p style="margin: 0 0 5px 0;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
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
      // Không cần await để request không bị treo chờ mail gửi xong
      sendEmail(customerInfo.email, 'Xác nhận đơn hàng ZComputer', emailContent);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi tạo đơn hàng' });
  }
};

// Lấy danh sách đơn hàng của TÔI
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) return res.status(401).json({ message: 'Unauthorized' });
    const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy chi tiết 1 đơn hàng (kiểm tra IDOR)
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    
    // IDOR Check
    if (order.user?.toString() !== req.user?.userId && req.user?.role !== 'admin' && req.user?.role !== 'staff') {
      return res.status(403).json({ message: 'Bạn không có quyền xem đơn hàng này' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Get all orders (Admin)
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng' });
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật trạng thái' });
  }
};
