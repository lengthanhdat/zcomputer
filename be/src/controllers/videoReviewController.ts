import { Request, Response } from 'express';
import { VideoReview } from '../models/VideoReview';

export const getVideoReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await VideoReview.find().populate('product_id', 'name price base_price images slug').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const createVideoReview = async (req: Request, res: Response) => {
  try {
    const { videoFileUrl, redirectLink, product_id } = req.body;

    const newReview = new VideoReview({ 
      videoFileUrl, 
      redirectLink: redirectLink || "", 
      product_id: product_id || undefined 
    });
    const saved = await newReview.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tạo review', error });
  }
};

export const updateVideoReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { videoFileUrl, redirectLink, product_id } = req.body;
    let updateData: any = { 
      videoFileUrl, 
      redirectLink: redirectLink || "", 
      product_id: product_id || null 
    };

    const updated = await VideoReview.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy review' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật review', error });
  }
};

export const deleteVideoReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await VideoReview.findByIdAndDelete(id);
    res.json({ message: 'Xóa review thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa review', error });
  }
};
