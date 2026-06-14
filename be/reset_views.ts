import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './src/models/Product';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI as string).then(async () => {
  console.log('Connected to DB');
  const res = await Product.updateMany({}, { views: 0 });
  console.log('Reset views for', res.modifiedCount, 'products to 0.');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
