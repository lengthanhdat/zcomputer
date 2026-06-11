import express from 'express';
import { getCategories, createCategory, deleteCategory, updateCategory } from '../controllers/categoryController';
import { authenticate, authorize } from '../middlewares/authorize';
import { ROLES } from '../utils/roles';

const router = express.Router();

router.get('/', getCategories);
router.post('/', authenticate, authorize([ROLES.ADMIN, ROLES.STAFF]), createCategory);
router.put('/:id', authenticate, authorize([ROLES.ADMIN, ROLES.STAFF]), updateCategory);
router.delete('/:id', authenticate, authorize([ROLES.ADMIN, ROLES.STAFF]), deleteCategory);

export default router;
