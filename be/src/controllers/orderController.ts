import { Request, Response } from 'express';
import { Order } from '../models/Order';


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
