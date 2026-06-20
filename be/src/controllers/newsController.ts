import { Request, Response } from 'express';
import { News } from '../models/News';

import mongoose from 'mongoose';

// Lấy danh sách bài viết (Public)
export const getAllNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, category, isPublished = true } = req.query;
    
    let query: any = {};
    
    // Nếu không phải admin, chỉ được xem bài đã publish
    if (isPublished === 'true' || isPublished === true) {
      query.isPublished = true;
    } else if (isPublished === 'false' && req.user) {
      // Chỉ admin mới có thể xem bài chưa publish, cần check role thật sự ở auth middleware, ở đây tạm giả định
      query.isPublished = false;
    }

    if (category) {
      query.category = category;
    }

    const total = await News.countDocuments(query);
    const articles = await News.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('author', 'name email');

    res.json({
      data: articles,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết 1 bài viết bằng Slug (Public)
export const getNewsBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const article = await News.findOne({ slug, isPublished: true }).populate('author', 'name email');

    if (!article) {
      res.status(404).json({ message: 'Không tìm thấy bài viết' });
      return;
    }

    // Tăng lượt xem
    article.views += 1;
    await article.save();

    res.json(article);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Lấy chi tiết bằng ID
export const getNewsById = async (req: Request, res: Response): Promise<void> => {
  try {
    const article = await News.findById(req.params.id);
    if (!article) {
      res.status(404).json({ message: 'News not found' });
      return;
    }
    res.json(article);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Tạo bài viết mới
export const createNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, slug, summary, content, thumbnail, category, tags, isPublished, authorName } = req.body;

    const existingNews = await News.findOne({ slug });
    if (existingNews) {
      res.status(400).json({ message: 'Slug đã tồn tại' });
      return;
    }

    const news = new News({
      title,
      slug,
      summary,
      content,
      thumbnail,
      category,
      tags,
      isPublished,
      authorName: authorName || "Admin ZComputer",
      author: req.user?.userId,
    });

    const savedNews = await news.save();
    res.status(201).json(savedNews);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: Cập nhật bài viết
export const updateNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const article = await News.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!article) {
      res.status(404).json({ message: 'Không tìm thấy bài viết' });
      return;
    }

    res.json(article);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: Xóa bài viết
export const deleteNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const article = await News.findByIdAndDelete(id);
    if (!article) {
      res.status(404).json({ message: 'Không tìm thấy bài viết' });
      return;
    }
    res.json({ message: 'Đã xóa bài viết thành công' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
