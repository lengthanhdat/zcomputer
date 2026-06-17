import express from 'express';
import { uploadImage, uploadVideo } from '../controllers/uploadController';
import { authenticate, authorize } from '../middlewares/authorize';
import { ROLES } from '../utils/roles';

const router = express.Router();

router.post('/image', authenticate, authorize([ROLES.ADMIN, ROLES.STAFF]), uploadImage);
router.post('/video', authenticate, authorize([ROLES.ADMIN, ROLES.STAFF]), uploadVideo);

export default router;
