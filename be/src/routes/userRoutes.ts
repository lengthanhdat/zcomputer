import express from 'express';
import { getUsers, deleteUser, updateUserRole } from '../controllers/userController';
import { authenticate, requirePermission } from '../middlewares/authorize';

const router = express.Router();

router.get('/', authenticate, requirePermission('MANAGE_USERS'), getUsers);
router.delete('/:id', authenticate, requirePermission('MANAGE_USERS'), deleteUser);
router.put('/:id/role', authenticate, requirePermission('MANAGE_USERS'), updateUserRole);

export default router;
