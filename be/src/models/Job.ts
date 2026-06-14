import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  department: string;
  location: string;
  salary: string;
  type: string;
  deadline: string;
  isHot: boolean;
  createdAt: Date;
}

const JobSchema: Schema = new Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  type: { type: String, required: true },
  deadline: { type: String, required: true },
  isHot: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IJob>('Job', JobSchema);
