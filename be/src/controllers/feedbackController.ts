import { Request, Response } from 'express';
import { Feedback } from '../models/Feedback';

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;
    const userId = req.user?.userId; // Will be available if logged in and authenticate middleware is used (though typically public route)

    const feedback = new Feedback({
      name,
      email,
      phone,
      message,
      userId
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback sent successfully', feedback });
  } catch (error) {
    res.status(500).json({ message: 'Error sending feedback', error });
  }
};

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).populate('userId', 'name email');
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedbacks', error });
  }
};

export const updateFeedbackStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(id, { status }, { new: true });
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error updating feedback status', error });
  }
};

export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndDelete(id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting feedback', error });
  }
};
