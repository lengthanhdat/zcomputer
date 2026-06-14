import { Request, Response } from 'express';
import { Category } from '../models/Category';
import slugify from 'slugify';

// Lấy danh sách danh mục
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().select('name slug description parent_id image').lean();
    res.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=60');
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
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tạo danh mục', error });
  }
};

// Xóa danh mục
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
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

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, slug: finalSlug, description, parent_id: parent_id || null, image },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật danh mục', error });
  }
};
