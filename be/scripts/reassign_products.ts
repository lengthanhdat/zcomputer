import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { Product } from '../src/models/Product';
import { Category } from '../src/models/Category';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to DB');

    const products = await Product.find();
    const categories = await Category.find();

    if (categories.length === 0) {
      console.log('No categories found!');
      process.exit(1);
    }

    let updated = 0;
    for (const p of products) {
      // Assign random category if no category_id or if category doesn't exist
      const randomCat = categories[Math.floor(Math.random() * categories.length)];
      p.category_id = randomCat._id as any;
      await p.save();
      updated++;
    }

    console.log(`Updated ${updated} products`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
