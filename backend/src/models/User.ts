import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string; // stored as a bcrypt hash, never plain text
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<IUser>('User', userSchema);