import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { Category } from './models/Category';
import { Product } from './models/Product';
import { Banner } from './models/Banner';
import { Order } from './models/Order';
import { User } from './models/User';
import { Permission } from './models/Permission';
import { Role } from './models/Role';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zcomputer';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for Seeding');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Banner.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({ email: 'admin@zcomputer.com' });

    // Create Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin@123', salt);
    await User.create({
      name: 'Super Admin',
      email: 'admin@zcomputer.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin account created: admin@zcomputer.com / admin@123');

    // Create Categories
    const laptop = await Category.create({ name: 'Laptop', slug: 'laptop' });
    const pc = await Category.create({ name: 'PC Gaming - Máy bộ', slug: 'pc-gaming' });
    const manHinh = await Category.create({ name: 'Màn Hình', slug: 'man-hinh' });
    const linhKien = await Category.create({ name: 'Linh Kiện PC', slug: 'linh-kien-pc' });
    const banPhim = await Category.create({ name: 'Bàn Phím', slug: 'ban-phim' });
    const chuot = await Category.create({ name: 'Chuột Máy Tính', slug: 'chuot' });
    const taiNghe = await Category.create({ name: 'Tai Nghe', slug: 'tai-nghe' });
    const phuKien = await Category.create({ name: 'Phụ Kiện Khác', slug: 'phu-kien-khac' });

    console.log('Database Seeding for Admin and Categories Completed! Products and Banners are left empty.');
    process.exit(0);
  } catch (error) {
    console.error('Error Seeding Database:', error);
    process.exit(1);
  }
};

seedData();
