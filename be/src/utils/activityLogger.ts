import { Request } from 'express';
import { ActivityLog } from '../models/ActivityLog';
import { User } from '../models/User';

export const logActivity = async (
  req: Request,
  action: string,
  entity: string,
  entityId?: string,
  entityDetails?: any,
  details?: any
) => {
  try {
    const user = req.user;
    if (!user) return; // Do not log if not authenticated

    // Only log Admin and Staff actions
    if (user.role !== 'admin' && user.role !== 'staff') return;

    // JWT payload has userId
    const userId = user.userId || user.id || user._id;
    if (!userId) return;

    // Fetch user details from DB to get name and email
    const dbUser = await User.findById(userId);

    await ActivityLog.create({
      userId: userId,
      userName: dbUser?.name || 'Unknown',
      userEmail: dbUser?.email || 'Unknown',
      userRole: user.role,
      action,
      entity,
      entityId,
      entityDetails,
      details,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || '',
      userAgent: req.headers['user-agent'] || ''
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
