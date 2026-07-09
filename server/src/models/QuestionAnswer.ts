import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionAnswer extends Document {
  sessionId: string;
  question: string;
  questionKey: string;
  answer: string;
  answerValue: string;
  timeSpent: number;
  timestamp: Date;
}

const QuestionAnswerSchema = new Schema<IQuestionAnswer>({
  sessionId: { type: String, required: true, index: true },
  question: { type: String, required: true },
  questionKey: { type: String, required: true },
  answer: { type: String, required: true },
  answerValue: { type: String, default: '' },
  timeSpent: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

QuestionAnswerSchema.index({ sessionId: 1, questionKey: 1 }, { unique: true });

export default mongoose.model<IQuestionAnswer>('QuestionAnswer', QuestionAnswerSchema);
