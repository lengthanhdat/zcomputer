import express from 'express';
import {
  getAllNews,
  getNewsBySlug,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
} from '../controllers/newsController';
import { authenticate, authorize } from '../middlewares/authorize';

const router = express.Router();

// Public routes
router.get('/', getAllNews);
router.get('/:slug', getNewsBySlug);

// Admin routes (Require Authentication & Authorization)
router.use(authenticate);
router.use(authorize(['admin', 'staff']));

router.get('/admin/:id', getNewsById);
router.post('/', createNews);
router.put('/:id', updateNews);
router.delete('/:id', deleteNews);

export default router;
