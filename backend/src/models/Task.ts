import { Schema, model, Document, Types } from 'mongoose';

export type Priority = 'low' | 'medium' | 'high';
export type Category = 'work' | 'personal' | 'study' | 'other';

export interface ITask extends Document {
  user: Types.ObjectId;
  title: string;
  description: string;
  dateTime: Date;   // when the task is scheduled
  deadline: Date;   // when it must be finished
  priority: Priority;
  category: Category;
  completed: boolean;
}

const taskSchema = new Schema<ITask>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    dateTime: { type: Date, required: true },
    deadline: { type: Date, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    category: { type: String, enum: ['work', 'personal', 'study', 'other'], default: 'other' },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<ITask>('Task', taskSchema);