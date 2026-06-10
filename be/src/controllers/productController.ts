import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import slugify from 'slugify';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Lấy danh sách sản phẩm
export const getProducts = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const categoryQuery = req.query.category as string;
    
    let filter: any = { status: 'active' };
    
    const searchQuery = req.query.search as string;
    if (searchQuery) {
      filter.name = { $regex: searchQuery, $options: 'i' };
    }
    
    if (categoryQuery) {
      const category = await Category.findOne({
        $or: [
          { slug: categoryQuery },
          ...(mongoose.isValidObjectId(categoryQuery) ? [{ _id: categoryQuery }] : [])
        ]
      });
      if (category) {
        filter.category_id = category._id;
      } else {
        return res.json([]);
      }
    }

    const products = await Product.find(filter)
      .populate('category_id', 'name slug')
      .select('-description')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách sản phẩm', error });
  }
};

// Lấy chi tiết một sản phẩm theo slug
export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug }).populate('category_id');
    
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết sản phẩm', error });
  }
};

// Tạo sản phẩm mới
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, category_id, brand, price, discountPrice, stock, sku, specs, images, gifts, description, condition } = req.body;
    
    // Tạo slug từ name
    let slug = slugify(name, { lower: true, strict: true, locale: 'vi' });
    // Kiểm tra trùng slug
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      slug = `${slug}-${Date.now()}`;
    }

    const newProduct = new Product({
      name, slug, category_id, brand, price, discountPrice, stock, sku, specs, images, gifts, description, condition
    });
    
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo sản phẩm mới', error });
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Nếu có update name, có thể cần update lại slug (tùy chọn)
    if (updateData.name) {
      let slug = slugify(updateData.name, { lower: true, strict: true, locale: 'vi' });
      const existing = await Product.findOne({ slug, _id: { $ne: id } });
      if (existing) {
        slug = `${slug}-${Date.now()}`;
      }
      updateData.slug = slug;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật' });
    }
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error });
  }
};

// Xóa sản phẩm
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' });
    }
    
    res.json({ message: 'Đã xóa sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error });
  }
};

// Trích xuất thông minh từ text bằng Gemini
export const smartExtract = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Vui lòng cung cấp văn bản cần trích xuất' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'GEMINI_API_KEY chưa được cấu hình trên server.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Bạn là chuyên gia phân tích dữ liệu máy tính. Hãy đọc đoạn text sau và trích xuất thành định dạng JSON CHÍNH XÁC.
Chỉ trả về chuỗi JSON hợp lệ, KHÔNG giải thích, KHÔNG thêm markdown (không \`\`\`json).

Cấu trúc JSON bắt buộc:
{
  "name": "Tên sản phẩm đầy đủ",
  "price": "Giá bán dạng SỐ (ví dụ: 15500000. Nếu text không nói rõ hoặc dùng từ như 'ib', 'liên hệ', hãy để 0)",
  "brand": "Tên hãng sản xuất (ví dụ: Dell, HP, ASUS, Apple, Lenovo... Cố gắng đoán từ tên nếu có thể)",
  "specs": {
    "cpu": "Thông tin CPU",
    "ram": "Thông tin RAM",
    "storage": "Thông tin ổ cứng (SSD/HDD)",
    "vga": "Thông tin Card màn hình (VGA)",
    "screen": "Thông tin màn hình (nếu có)"
  },
  "condition": "Tình trạng máy (ví dụ: Mới, Cũ 99%, Likenew)"
}

Đoạn text cần phân tích:
"""
${text}
"""
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    
    // Dọn dẹp nếu AI trả về markdown code block
    if (responseText.startsWith('\`\`\`json')) {
      responseText = responseText.replace(/^\`\`\`json\n/, '');
    }
    if (responseText.endsWith('\`\`\`')) {
      responseText = responseText.replace(/\n\`\`\`$/, '');
    }

    const parsedData = JSON.parse(responseText);
    res.json(parsedData);
  } catch (error: any) {
    console.error('Smart Extract Error:', error);
    res.status(500).json({ message: 'Lỗi trích xuất AI', error: error?.message || 'Unknown error' });
  }
};
