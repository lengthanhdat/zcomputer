import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './src/models/Product';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI as string).then(async () => {
  const docs = await Product.find({}).select('name views');
  console.log('Product Views:');
  docs.forEach(doc => console.log(`${doc.name}: ${doc.views}`));
  process.exit(0);
});
