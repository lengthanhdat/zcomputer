import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zcomputer';

app.use(cors());
app.use(compression()); // gzip all responses
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Request timeout middleware (10s)
app.use((req, res, next) => {
  res.setTimeout(10000, () => {
    res.status(408).json({ message: 'Request Timeout' });
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

app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/upload', uploadRoutes);

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
