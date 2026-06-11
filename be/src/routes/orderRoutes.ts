import express from 'express';
import { createOrder, getOrders, updateOrderStatus, getMyOrders, getOrderById } from '../controllers/orderController';
import { authenticate, requirePermission } from '../middlewares/authorize';

const router = express.Router();

router.post('/', createOrder);
router.get('/my-orders', authenticate, getMyOrders);

// Admin / Staff routes
router.get('/', authenticate, requirePermission('VIEW_ORDERS'), getOrders);
router.get('/:id', authenticate, getOrderById);
router.put('/:id/status', authenticate, requirePermission('EDIT_ORDERS'), updateOrderStatus);

export default router;
