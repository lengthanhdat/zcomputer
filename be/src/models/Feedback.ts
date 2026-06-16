import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  name: string;
  email: string;
  phone?: string;
  message: string;
  userId?: mongoose.Types.ObjectId;
  status: 'new' | 'read' | 'resolved';
  createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['new', 'read', 'resolved'], default: 'new' },
  createdAt: { type: Date, default: Date.now },
});

export const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);
