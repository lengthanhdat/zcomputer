import { Request, Response } from 'express';
import { Banner } from '../models/Banner';

export const getBanners = async (req: Request, res: Response) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getActiveBanners = async (req: Request, res: Response) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
    res.set('Cache-Control', 'no-store');
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const createBanner = async (req: Request, res: Response) => {
  try {
    const banner = new Banner(req.body);
    const saved = await banner.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const updateBanner = async (req: Request, res: Response) => {
  try {
    const updated = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa banner' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};
