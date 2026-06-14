import express from 'express';
import { uploadImage, uploadVideo } from '../controllers/uploadController';

const router = express.Router();

router.post('/image', uploadImage);
router.post('/video', uploadVideo);

export default router;
