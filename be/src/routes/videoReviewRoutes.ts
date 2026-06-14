import express from 'express';
import { getVideoReviews, createVideoReview, updateVideoReview, deleteVideoReview } from '../controllers/videoReviewController';
import { authenticate, authorize } from '../middlewares/authorize';

const router = express.Router();
const adminMiddleware = [authenticate, authorize(['admin', 'staff'])];

router.get('/', getVideoReviews);
router.post('/', adminMiddleware, createVideoReview);
router.put('/:id', adminMiddleware, updateVideoReview);
router.delete('/:id', adminMiddleware, deleteVideoReview);

export default router;
