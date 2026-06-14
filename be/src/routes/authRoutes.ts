import express from 'express';
import { login, register, refreshToken, logout, googleLogin, forgotPassword, resetPassword } from '../controllers/authController';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 10, // Giới hạn 10 lần thử đăng nhập
  message: { message: 'Quá nhiều lần thử đăng nhập, vui lòng thử lại sau 15 phút' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 5, // Chỉ cho phép tạo tối đa 5 tài khoản/giờ/IP
  message: { message: 'Quá nhiều lần đăng ký, vui lòng thử lại sau 1 giờ' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
