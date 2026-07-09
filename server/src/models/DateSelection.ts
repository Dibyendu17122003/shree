import mongoose, { Schema, Document } from 'mongoose';

export interface IDateSelection extends Document {
  sessionId: string;
  selectedDate: string;
  selectedTime: string;
  dateAccepted: boolean;
  promiseChecklist: string[];
  loveMeterValue: number;
  excitementLevel: string;
  timestamp: Date;
}

const DateSelectionSchema = new Schema<IDateSelection>({
  sessionId: { type: String, required: true, unique: true },
  selectedDate: { type: String, default: '' },
  selectedTime: { type: String, default: '' },
  dateAccepted: { type: Boolean, default: false },
  promiseChecklist: [{ type: String }],
  loveMeterValue: { type: Number, default: 0 },
  excitementLevel: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IDateSelection>('DateSelection', DateSelectionSchema);
