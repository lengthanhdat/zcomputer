import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://192.168.50.213:3000'],
    credentials: true
  }
});
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zcomputer';

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://192.168.50.213:3000'],
  credentials: true
}));
app.use(compression()); 
app.use(helmet({
  contentSecurityPolicy: false, // Let Next.js handle CSP
  hsts: false // Not using HTTPS locally
}));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(mongoSanitize());

// Global rate limiter: 3000 requests per IP per 15 minutes to avoid blocking Next.js SSR/Builds
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3000,
  message: { message: 'Quá nhiều yêu cầu, vui lòng thử lại sau.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path.startsWith('/uploads'), // Don't limit static files
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
import chatRoutes from './routes/chatRoutes';

app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/chat', chatRoutes);

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

import { Message } from './models/Message';

// --- Socket.IO Setup ---
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins a session room
  socket.on('join', (sessionId: string) => {
    if (sessionId) {
      socket.join(sessionId);
      console.log(`Socket ${socket.id} joined session ${sessionId}`);
    }
  });

  // Admin joins the admin room
  socket.on('joinAdmin', () => {
    socket.join('admin-room');
    console.log(`Admin ${socket.id} joined admin-room`);
  });

  // Handle incoming messages
  socket.on('sendMessage', async (data: { sessionId: string; content: string; isAdmin: boolean; senderId?: string }) => {
    try {
      // Save message to database
      const newMessage = new Message({
        sessionId: data.sessionId,
        content: data.content,
        isAdmin: data.isAdmin,
        senderId: data.senderId || null,
        isRead: false
      });
      await newMessage.save();

      // Broadcast to the user's specific room
      io.to(data.sessionId).emit('newMessage', newMessage);

      // Also broadcast to admin room so admins see it immediately
      io.to('admin-room').emit('adminMessage', newMessage);
      
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('markAsRead', async (data: { sessionId: string; isAdmin: boolean }) => {
    try {
      // If admin marks as read, update all user messages to isRead = true
      // If user marks as read, update all admin messages to isRead = true
      await Message.updateMany(
        { sessionId: data.sessionId, isAdmin: !data.isAdmin, isRead: false },
        { $set: { isRead: true } }
      );
      io.to(data.sessionId).emit('messagesRead', { sessionId: data.sessionId, isAdmin: data.isAdmin });
      io.to('admin-room').emit('messagesRead', { sessionId: data.sessionId, isAdmin: data.isAdmin });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

// Trigger nodemon restart
