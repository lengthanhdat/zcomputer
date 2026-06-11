import express from 'express';
import { login, register, refreshToken, logout, googleLogin } from '../controllers/authController';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 10, // Giới hạn 10 lần gửi request
  message: { message: 'Quá nhiều lần thử đăng nhập, vui lòng thử lại sau 15 phút' }
});

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.post('/google', googleLogin);

export default router;
