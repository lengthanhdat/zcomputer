import express from 'express';
import { getUsers, deleteUser, updateUserRole } from '../controllers/userController';

const router = express.Router();

router.get('/', getUsers);
router.delete('/:id', deleteUser);
router.put('/:id/role', updateUserRole);

export default router;
