import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zcomputer';

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(compression()); 
app.use(helmet({
  contentSecurityPolicy: false, // Let Next.js handle CSP
  hsts: false // Not using HTTPS locally
}));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

// Global rate limiter: 3000 requests per IP per 15 minutes to avoid blocking Next.js SSR/Builds
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3000,
  message: { message: 'Quá nhiều yêu cầu, vui lòng thử lại sau.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: any) => req.path.startsWith('/uploads'), // Don't limit static files
});
app.use('/api', globalLimiter);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Request timeout middleware (60s) for AI tasks
app.use((req, res, next) => {
  res.setTimeout(60000, () => {
    if (!res.headersSent) {
      res.status(408).json({ message: 'Request Timeout' });
    }
  });
  next();
});

// Import models to ensure they are registered
import './models/User';
import './models/Category';
import './models/Product';
import './models/Order';

import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import authRoutes from './routes/authRoutes';

import { User } from './models/User';
import { Product } from './models/Product';
import { Category } from './models/Category';
import { Order } from './models/Order';

// Routes
app.get('/', (req, res) => {
  res.send('ZCOMPUTER API IS RUNNING');
});

app.get('/api/stats', async (req, res) => {
  try {
    const products = await Product.countDocuments();
    const categories = await Category.countDocuments();
    const users = await User.countDocuments();
    const orders = await Order.countDocuments();
    
    const revenueResult = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const revenue = revenueResult[0]?.total || 0;

    res.json({ products, categories, users, orders, revenue });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
import bannerRoutes from './routes/bannerRoutes';
import uploadRoutes from './routes/uploadRoutes';
import settingRoutes from './routes/settingRoutes';
import videoReviewRoutes from './routes/videoReviewRoutes';
import jobRoutes from './routes/jobRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import newsRoutes from './routes/newsRoutes';
import logRoutes from './routes/logRoutes';

app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/video-reviews', videoReviewRoutes);

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/logs', logRoutes);

import { Subscriber } from './models/Subscriber';

app.post('/api/subscribers', async (req, res): Promise<any> => {
  try {
    const { email } = req.body;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Email không hợp lệ' });
    }
    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email này đã được đăng ký' });
    }
    await Subscriber.create({ email });
    return res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

app.get('/api/subscribers', async (req, res): Promise<any> => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    return res.json(subscribers);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

app.delete('/api/subscribers/:id', async (req, res): Promise<any> => {
  try {
    const { id } = req.params;
    await Subscriber.findByIdAndDelete(id);
    return res.json({ message: 'Đã xóa email' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
});


// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    // Tăng timeout cho Express server lên 5 phút để tránh lỗi socket hang up khi chờ AI xử lý lâu
    server.keepAliveTimeout = 300000;
    server.headersTimeout = 300000;
    server.setTimeout(300000);
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

// Trigger nodemon restart




