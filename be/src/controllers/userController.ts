import { Request, Response } from 'express';
import { User } from '../models/User';
import { logActivity } from '../utils/activityLogger';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    if (req.user?.userId === req.params.id) {
      return res.status(403).json({ message: 'Bạn không thể tự xóa chính mình' });
    }
    const userToDelete = await User.findById(req.params.id);
    await User.findByIdAndDelete(req.params.id);
    
    if (userToDelete) {
      await logActivity(req, 'DELETE', 'User', userToDelete._id.toString(), userToDelete, { email: userToDelete.email });
    }

    res.json({ message: 'Đã xóa người dùng' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi xóa người dùng' });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    if (req.user?.userId === req.params.id) {
      return res.status(403).json({ message: 'Bạn không thể tự thay đổi quyền của chính mình' });
    }
    const { role, permissions } = req.body;
    
    // Xây dựng object update
    const updateData: any = { role };
    if (permissions !== undefined) {
      updateData.permissions = permissions;
    }

    const oldUser = await User.findById(req.params.id).select('-password');
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });

    await logActivity(req, 'UPDATE', 'User', user._id.toString(), user, { old: oldUser, new: updateData });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi cập nhật quyền' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, phone } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Chưa xác thực' });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi cập nhật profile' });
  }
};
