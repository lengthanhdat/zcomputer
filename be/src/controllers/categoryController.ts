import { Request, Response } from 'express';
import { Category } from '../models/Category';
import slugify from 'slugify';
import { logActivity } from '../utils/activityLogger';

// Lấy danh sách danh mục
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ order: 1, createdAt: 1 }).select('name slug description parent_id image order').lean();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh mục', error });
  }
};

// Tạo danh mục mới
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, parent_id, image } = req.body;
    let slug = slugify(name, { lower: true, strict: true, locale: 'vi' });

    const existing = await Category.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const newCategory = new Category({ name, slug, description, parent_id: parent_id || null, image });
    const saved = await newCategory.save();
    
    await logActivity(req, 'CREATE', 'Category', saved._id.toString(), saved, { name: saved.name });
    
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tạo danh mục', error });
  }
};

// Xóa danh mục
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoryToDelete = await Category.findById(id);
    await Category.findByIdAndDelete(id);
    
    if (categoryToDelete) {
      await logActivity(req, 'DELETE', 'Category', categoryToDelete._id.toString(), categoryToDelete, { name: categoryToDelete.name });
    }
    
    res.json({ message: 'Xóa danh mục thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa danh mục', error });
  }
};

// Cập nhật danh mục
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, parent_id, image } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Tên danh mục không được bỏ trống' });
    }

    const newSlug = slugify(name, { lower: true, strict: true, locale: 'vi' });

    // Check slug collision with OTHER categories
    const collision = await Category.findOne({ slug: newSlug, _id: { $ne: id } });
    const finalSlug = collision ? `${newSlug}-${Date.now()}` : newSlug;

    const oldCategory = await Category.findById(id);

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, slug: finalSlug, description, parent_id: parent_id || null, image },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }

    await logActivity(req, 'UPDATE', 'Category', updated._id.toString(), updated, { old: oldCategory, new: { name, description, parent_id, image } });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật danh mục', error });
  }
};

// Reorder categories
export const reorderCategories = async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // Array of { id, order }
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order }
      }
    }));

    await Category.bulkWrite(bulkOps);
    res.json({ message: 'Cập nhật vị trí thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật vị trí', error });
  }
};
