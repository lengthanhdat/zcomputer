import express from 'express';
import { getBanners, getActiveBanners, createBanner, updateBanner, deleteBanner } from '../controllers/bannerController';
import { authenticate, authorize } from '../middlewares/authorize';
import { ROLES } from '../utils/roles';

const router = express.Router();

router.get('/', getBanners);
router.get('/active', getActiveBanners);
router.post('/', authenticate, authorize([ROLES.ADMIN, ROLES.STAFF]), createBanner);
router.put('/:id', authenticate, authorize([ROLES.ADMIN, ROLES.STAFF]), updateBanner);
router.delete('/:id', authenticate, authorize([ROLES.ADMIN, ROLES.STAFF]), deleteBanner);

export default router;
