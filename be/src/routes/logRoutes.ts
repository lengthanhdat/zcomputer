import express from 'express';
import { getLogs } from '../controllers/logController';
import { authenticate, authorize } from '../middlewares/authorize';

const router = express.Router();

// Only admin can view logs
router.get('/', authenticate, authorize(['admin']), getLogs);

export default router;
