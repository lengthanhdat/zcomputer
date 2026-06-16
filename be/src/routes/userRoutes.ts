import express from 'express';
import { getUsers, deleteUser, updateUserRole, updateProfile } from '../controllers/userController';
import { authenticate, requirePermission } from '../middlewares/authorize';

const router = express.Router();

router.put('/profile', authenticate, updateProfile);
router.get('/', authenticate, requirePermission('MANAGE_USERS'), getUsers);
router.delete('/:id', authenticate, requirePermission('MANAGE_USERS'), deleteUser);
router.put('/:id/role', authenticate, requirePermission('MANAGE_USERS'), updateUserRole);

export default router;
