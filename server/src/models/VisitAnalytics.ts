import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitAnalytics extends Document {
  sessionId: string;
  page: string;
  referrer: string;
  ip: string;
  userAgent: string;
  browser: string;
  device: string;
  os: string;
  location: string;
  city: string;
  timestamp: Date;
  timeOnPage: number;
}

const VisitAnalyticsSchema = new Schema<IVisitAnalytics>({
  sessionId: { type: String, required: true, index: true },
  page: { type: String, required: true },
  referrer: { type: String, default: '' },
  ip: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  browser: { type: String, default: 'Unknown' },
  device: { type: String, default: 'Unknown' },
  os: { type: String, default: 'Unknown' },
  location: { type: String, default: 'Unknown' },
  city: { type: String, default: 'Unknown' },
  timestamp: { type: Date, default: Date.now },
  timeOnPage: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IVisitAnalytics>('VisitAnalytics', VisitAnalyticsSchema);
