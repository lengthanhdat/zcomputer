import express from 'express';
import { getMessagesBySession, getAllSessions } from '../controllers/chatController';
import { authenticate, authorize } from '../middlewares/authorize';
import { ROLES } from '../utils/roles';

const router = express.Router();

router.get('/session/:sessionId', getMessagesBySession);
router.get('/sessions', authenticate, authorize([ROLES.ADMIN]), getAllSessions);

export default router;
