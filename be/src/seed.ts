import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category } from './models/Category';
import { Product } from './models/Product';
import { Banner } from './models/Banner';
import { Order } from './models/Order';

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

    // Create Used Categories
    const laptopCu = await Category.create({ name: 'Laptop Cũ', slug: 'laptop-cu' });
    const pcCu = await Category.create({ name: 'PC Cũ', slug: 'pc-cu' });
    const manHinhCu = await Category.create({ name: 'Màn Hình Cũ', slug: 'man-hinh-cu' });
    const linhKienCu = await Category.create({ name: 'Linh Kiện Cũ', slug: 'linh-kien-cu' });

    // Create Active Banners
    await Banner.create({
      title: 'ZCOMPUTER - CHUYÊN LAPTOP CŨ & PC CŨ CHẤT LƯỢNG CAO',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
      link: '/laptop',
      isActive: true,
      order: 1
    });

    // Create Used Products
    await Product.create([
      {
        name: 'Laptop Dell Latitude 7490 (Core i5 8350U/ 8GB/ 256GB/ 14" FHD)',
        slug: 'laptop-dell-latitude-7490-cu',
        description: 'Laptop văn phòng siêu bền bỉ, mỏng nhẹ, hiệu năng mượt mà ổn định cho học tập và làm việc.',
        price: 5500000,
        discountPrice: 6500000,
        category_id: laptopCu._id,
        brand: 'Dell',
        images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400&h=300'],
        specs: {
          CPU: 'Intel Core i5 8350U',
          RAM: '8GB DDR4',
          Storage: '256GB SSD',
          Screen: '14 inch FHD IPS'
        },
        stock: 5,
        status: 'active',
        condition: 'Đã qua sử dụng (Đẹp 99%)'
      },
      {
        name: 'Laptop Asus ROG Strix G15 Cũ (Ryzen 7 4800H/ 16GB/ 512GB/ GTX 1650)',
        slug: 'laptop-asus-rog-strix-g15-cu',
        description: 'Laptop gaming phân khúc giá rẻ, tản nhiệt mát mẻ, cân tốt Liên Minh, Valorant, Fifa Online 4.',
        price: 12500000,
        discountPrice: 14000000,
        category_id: laptopCu._id,
        brand: 'ASUS',
        images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=400&h=300'],
        specs: {
          CPU: 'Ryzen 7 4800H',
          RAM: '16GB DDR4',
          Storage: '512GB SSD',
          VGA: 'GTX 1650 4GB'
        },
        stock: 3,
        status: 'active',
        condition: 'Đã qua sử dụng (Đẹp 98%, Nguyên bản)'
      },
      {
        name: 'PC Gaming Cũ Core i5-10400F / 16GB / SSD 256GB / GTX 1660 Super',
        slug: 'pc-gaming-cu-i5-10400f',
        description: 'Cỗ máy chiến game quốc dân chơi mượt các tựa game Esport và làm đồ họa Photoshop, Premiere nhẹ nhàng.',
        price: 7900000,
        discountPrice: 8900000,
        category_id: pcCu._id,
        brand: 'ZCOMPUTER',
        images: ['https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=400&h=300'],
        specs: {
          CPU: 'Intel Core i5 10400F',
          RAM: '16GB DDR4',
          Storage: '256GB SSD NVMe',
          VGA: 'GTX 1660 Super 6GB'
        },
        stock: 2,
        status: 'active',
        condition: 'Đã qua sử dụng (Các linh kiện còn bảo hành hãng ngắn)'
      },
      {
        name: 'Màn hình Dell Professional P2419H 24" IPS Cũ',
        slug: 'man-hinh-dell-p2419h-cu',
        description: 'Màn hình văn phòng chuyên nghiệp, tấm nền IPS màu sắc chuẩn xác, chân xoay linh hoạt tiện lợi.',
        price: 2100000,
        discountPrice: 2600000,
        category_id: manHinhCu._id,
        brand: 'Dell',
        images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400&h=300'],
        specs: {
          Size: '23.8 inch',
          Panel: 'IPS',
          Resolution: 'Full HD (1920 x 1080)',
          RefreshRate: '60Hz'
        },
        stock: 8,
        status: 'active',
        condition: 'Đã qua sử dụng (Màn đẹp không sọc, không điểm chết)'
      },
      {
        name: 'Card màn hình Gigabyte GTX 1660 Super 6GB Cũ',
        slug: 'vga-gigabyte-gtx-1660-super-cu',
        description: 'VGA quốc dân cho mọi cấu hình PC gaming giá rẻ, hàng văn phòng thanh lý cực đẹp.',
        price: 2500000,
        discountPrice: 2900000,
        category_id: linhKienCu._id,
        brand: 'Gigabyte',
        images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400&h=300'],
        specs: {
          Chipset: 'GeForce GTX 1660 SUPER',
          Memory: '6GB GDDR6',
          Bus: '192-bit'
        },
        stock: 15,
        status: 'active',
        condition: 'Đã qua sử dụng (Zin bản, sạch đẹp 97%)'
      }
    ]);

    console.log('Database Seeding for Used Products Completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error Seeding Database:', error);
    process.exit(1);
  }
};

seedData();
