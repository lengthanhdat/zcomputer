import express from 'express';
import { getBanners, getActiveBanners, createBanner, updateBanner, deleteBanner } from '../controllers/bannerController';

const router = express.Router();

router.get('/', getBanners);
router.get('/active', getActiveBanners);
router.post('/', createBanner);
router.put('/:id', updateBanner);
router.delete('/:id', deleteBanner);

export default router;
