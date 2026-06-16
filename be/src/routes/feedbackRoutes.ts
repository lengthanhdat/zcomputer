import express from 'express';
import { createFeedback, getFeedbacks, updateFeedbackStatus, deleteFeedback } from '../controllers/feedbackController';
import { authenticate, authorize } from '../middlewares/authorize';

const router = express.Router();

// Public (or authenticated) route to submit feedback
import jwt from 'jsonwebtoken';

const optionalAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = decoded;
    } catch (e) {
      // ignore
    }
  }
  next();
};

router.post('/', optionalAuth, createFeedback);

// Admin routes
router.get('/', authenticate, authorize(['admin', 'staff']), getFeedbacks);
router.put('/:id/status', authenticate, authorize(['admin', 'staff']), updateFeedbackStatus);
router.delete('/:id', authenticate, authorize(['admin', 'staff']), deleteFeedback);

export default router;
