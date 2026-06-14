import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { Category } from '../src/models/Category';

// Load env vars
dotenv.config();

const subcategories = [
  "Laptop Dell Cũ",
  "Laptop HP Cũ",
  "Laptop Lenovo Cũ",
  "Macbook cũ",
  "Laptop LG Cũ",
  "Laptop Surface Cũ",
  "Laptop Gateway Cũ",
  "Laptop Gigabyte Cũ"
];

function generateSlug(name: string): string {
  return name.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function run() {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/zcomputer";
    await mongoose.connect(mongoUri);
    
    const parent = await Category.findOne({ name: "Laptop Cũ" });
    if (!parent) {
      console.log("Parent 'Laptop Cũ' not found.");
      process.exit(1);
    }

    const docs = subcategories.map(name => ({
      name,
      slug: generateSlug(name),
      parent_id: parent._id
    }));

    await Category.insertMany(docs);
    console.log("Subcategories inserted successfully!");

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

run();
