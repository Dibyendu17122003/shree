import mongoose, { Schema, Document } from 'mongoose';

export interface IUserSession extends Document {
  sessionId: string;
  ip: string;
  userAgent: string;
  browser: string;
  device: string;
  os: string;
  location: string;
  city: string;
  completed: boolean;
  dateAccepted: boolean;
  startTime: Date;
  endTime: Date | null;
  completionPercentage: number;
  totalTimeSpent: number;
}

const UserSessionSchema = new Schema<IUserSession>({
  sessionId: { type: String, required: true, unique: true },
  ip: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  browser: { type: String, default: 'Unknown' },
  device: { type: String, default: 'Unknown' },
  os: { type: String, default: 'Unknown' },
  location: { type: String, default: 'Unknown' },
  city: { type: String, default: 'Unknown' },
  completed: { type: Boolean, default: false },
  dateAccepted: { type: Boolean, default: false },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, default: null },
  completionPercentage: { type: Number, default: 0 },
  totalTimeSpent: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IUserSession>('UserSession', UserSessionSchema);
