import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined in environment variables!');

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ['CREATE_PRODUCT', 'EDIT_PRODUCT', 'DELETE_PRODUCT', 'VIEW_ORDERS', 'EDIT_ORDERS', 'MANAGE_USERS'],
  staff: ['CREATE_PRODUCT', 'EDIT_PRODUCT', 'VIEW_ORDERS', 'EDIT_ORDERS'],
  customer: []
};

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Không tìm thấy token hoặc token không hợp lệ' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

export const requirePermission = (permissionCode: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role as string;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    if (userPermissions.includes(permissionCode)) {
      next();
    } else {
      res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
    }
  };
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Không xác định được quyền của người dùng' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này' });
    }
    next();
  };
};
