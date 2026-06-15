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
    
    let filter: any = { status: { $in: ['active', 'out_of_stock'] } };
    
    const searchQuery = req.query.search as string;
    if (searchQuery) {
      filter.name = { $regex: searchQuery, $options: 'i' };
    }
    
    if (categoryQuery && categoryQuery !== 'all') {
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
    const { name, category_id, brand, price, discountPrice, stock, sku, specs, images, gifts, description, condition, isHotSale, flashSalePrice } = req.body;
    
    // Tạo slug từ name
    let slug = slugify(name, { lower: true, strict: true, locale: 'vi' });
    // Kiểm tra trùng slug
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      slug = `${slug}-${Date.now()}`;
    }

    const newProduct = new Product({
      name, slug, category_id, brand, price, discountPrice, stock, sku, specs, images, gifts, description, condition, isHotSale, flashSalePrice
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

// Xóa nhiều sản phẩm
export const deleteBulkProducts = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Vui lòng cung cấp danh sách ID sản phẩm cần xóa' });
    }
    
    const result = await Product.deleteMany({ _id: { $in: ids } });
    
    res.json({ message: `Đã xóa ${result.deletedCount} sản phẩm thành công`, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa nhiều sản phẩm', error });
  }
};

// Trích xuất thông minh từ text bằng Gemini
export const smartExtract = async (req: Request, res: Response) => {
  try {
    const { text, categories } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Vui lòng cung cấp văn bản cần trích xuất' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'GEMINI_API_KEY chưa được cấu hình trên server.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const categoryInstruction = categories && Array.isArray(categories) && categories.length > 0
      ? `Tên danh mục CHÍNH XÁC (Hãy CHỌN MỘT trong các danh mục sau: ${categories.join(', ')}. Ưu tiên chọn danh mục con chi tiết nhất. Ví dụ: Nếu là Laptop Dell, hãy chọn "Laptop Dell Cũ" thay vì "Laptop Cũ". Nếu không thấy cái nào phù hợp thì để trống)`
      : `Tên danh mục (ví dụ: Laptop, PC, Màn Hình... Cố gắng phân loại dựa vào tên sản phẩm)`;

    const prompt = `
Bạn là chuyên gia phân tích dữ liệu máy tính. Hãy đọc đoạn text sau và trích xuất thành định dạng JSON CHÍNH XÁC.
Chỉ trả về chuỗi JSON hợp lệ, KHÔNG giải thích, KHÔNG thêm markdown (không \`\`\`json).

Cấu trúc JSON bắt buộc:
{
  "name": "Tên sản phẩm đầy đủ",
  "price": "Giá bán dạng SỐ (ví dụ: 15500000. Nếu text không nói rõ hoặc dùng từ như 'ib', 'liên hệ', hãy để 0)",
  "brand": "Tên hãng sản xuất (ví dụ: Dell, HP, ASUS, Apple, Lenovo... Cố gắng đoán từ tên nếu có thể)",
  "category_name": "${categoryInstruction}",
  "stock": "Số lượng tồn kho dạng SỐ (nếu không rõ thì để 10)",
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

// Trích xuất hàng loạt từ text/excel bằng Gemini
export const smartExtractBulk = async (req: Request, res: Response) => {
  try {
    let { text, categories } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Vui lòng cung cấp nội dung cần trích xuất' });
    }

    // Nếu text là một URL, thử fetch nội dung
    if (text.trim().startsWith('http://') || text.trim().startsWith('https://')) {
      let fetchUrl = text.trim();
      
      // Chuyển đổi link Google Sheets thành link tải CSV tự động
      const sheetsMatch = fetchUrl.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (sheetsMatch) {
        // Lấy gid nếu có (để tải đúng sheet)
        const gidMatch = fetchUrl.match(/[#&]gid=([0-9]+)/);
        const gid = gidMatch ? `&gid=${gidMatch[1]}` : '';
        fetchUrl = `https://docs.google.com/spreadsheets/d/${sheetsMatch[1]}/export?format=csv${gid}`;
      } 
      // Chuyển đổi link Google Docs thành link tải Text tự động
      else if (fetchUrl.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9-_]+)/)) {
        const docMatch = fetchUrl.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9-_]+)/);
        fetchUrl = `https://docs.google.com/document/d/${docMatch![1]}/export?format=txt`;
      }

      let html = "";
      let fetchSuccess = false;
      for (let i = 0; i < 3; i++) {
        try {
          const response = await fetch(fetchUrl);
          if (!response.ok) {
             return res.status(400).json({ message: `Không thể truy cập link này (Lỗi ${response.status}). Có thể trang web chặn lấy dữ liệu hoặc file Google Docs chưa được mở quyền chia sẻ (Public).` });
          }
          html = await response.text();
          fetchSuccess = true;
          break;
        } catch (err) {
          console.error(`Fetch URL attempt ${i+1} failed:`, err);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if (!fetchSuccess) {
        return res.status(400).json({ message: 'Không thể tải nội dung do mạng không ổn định (đã thử 3 lần). Vui lòng thử lại.' });
      }
      
      // Nếu là Google Docs/Sheets export thì text đã là raw text/csv
      if (sheetsMatch || fetchUrl.includes('export?format=')) {
         text = html;
      } else {
         // Lấy đoạn text thô (bỏ tag HTML), bao gồm cả script và style
         text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
                    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
                    .replace(/<[^>]*>?/gm, ' ');
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'GEMINI_API_KEY chưa được cấu hình trên server.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const categoryInstruction = categories && Array.isArray(categories) && categories.length > 0
      ? `Tên danh mục CHÍNH XÁC (Hãy CHỌN MỘT trong các danh mục sau: ${categories.join(', ')}. Ưu tiên chọn danh mục con chi tiết nhất. Ví dụ: Nếu là Laptop Dell, hãy chọn "Laptop Dell Cũ" thay vì "Laptop Cũ". Nếu không thấy cái nào phù hợp thì để trống)`
      : `Tên danh mục (nếu có trong dữ liệu, ví dụ: Laptop, PC, Màn Hình... Hoặc tự dự đoán)`;

    const prompt = `
Bạn là chuyên gia phân tích dữ liệu máy tính. Hãy đọc đoạn nội dung sau (có thể là văn bản hoặc HTML thô) và trích xuất TẤT CẢ các sản phẩm tìm thấy thành một MẢNG JSON (Array of Objects).
Chỉ trả về MẢNG JSON hợp lệ. Nếu không tìm thấy bất kỳ sản phẩm nào, hãy trả về mảng rỗng [].

Cấu trúc MẢNG JSON bắt buộc:
[
  {
    "name": "Tên sản phẩm đầy đủ",
    "price": "Giá bán dạng SỐ (ví dụ: 15500000. Nếu không rõ, để 0)",
    "brand": "Tên hãng sản xuất",
    "category_name": "${categoryInstruction}",
    "stock": "Số lượng tồn kho dạng SỐ (nếu không nói rõ thì để 10)",
    "specs": {
      "cpu": "Thông tin CPU",
      "ram": "Thông tin RAM",
      "storage": "Thông tin ổ cứng (SSD/HDD)",
      "vga": "Thông tin Card màn hình (VGA)",
      "screen": "Thông tin màn hình (nếu có)"
    },
    "condition": "Tình trạng máy (ví dụ: Mới, Cũ 99%, Likenew)"
  }
]

Đoạn text cần phân tích:
"""
${text.substring(0, 50000)}
"""
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    
    // Tìm mảng JSON hoặc object JSON bằng regex để tránh lỗi do markdown hoặc văn bản dư thừa
    let parsedData = [];
    const arrayMatch = responseText.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      parsedData = JSON.parse(arrayMatch[0]);
    } else {
      const objMatch = responseText.match(/\{[\s\S]*\}/);
      if (objMatch) {
        parsedData = [JSON.parse(objMatch[0])];
      } else {
        throw new Error("AI không trả về JSON hợp lệ: " + responseText);
      }
    }

    if (!res.headersSent) {
      res.json(Array.isArray(parsedData) ? parsedData : [parsedData]);
    }
  } catch (error: any) {
    console.error('Smart Extract Bulk Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Hệ thống AI đang quá tải hoặc phản hồi chậm. Vui lòng thử lại sau.', error: error?.message || 'Unknown error' });
    }
  }
};

// Tăng lượt xem sản phẩm
export const incrementViews = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    await Product.updateOne({ slug }, { $inc: { views: 1 } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};
