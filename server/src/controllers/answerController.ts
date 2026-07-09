import { Request, Response } from 'express';
import QuestionAnswer from '../models/QuestionAnswer';
import DateSelection from '../models/DateSelection';
import UserSession from '../models/UserSession';

export const saveAnswer = async (req: Request, res: Response) => {
  try {
    const { sessionId, question, questionKey, answer, answerValue, timeSpent } = req.body;

    const existing = await QuestionAnswer.findOne({ sessionId, questionKey });
    if (existing) {
      existing.answer = answer;
      existing.answerValue = answerValue || '';
      existing.timeSpent = timeSpent || 0;
      existing.timestamp = new Date();
      await existing.save();
      return res.json({ message: 'Answer updated', answer: existing });
    }

    const newAnswer = new QuestionAnswer({
      sessionId,
      question,
      questionKey,
      answer,
      answerValue: answerValue || '',
      timeSpent: timeSpent || 0,
      timestamp: new Date(),
    });

    await newAnswer.save();
    res.status(201).json({ message: 'Answer saved', answer: newAnswer });
  } catch (error) {
    console.error('Save answer error:', error);
    res.status(500).json({ error: 'Failed to save answer' });
  }
};

export const getAnswers = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const answers = await QuestionAnswer.find({ sessionId }).sort({ timestamp: 1 });
    res.json(answers);
  } catch (error) {
    console.error('Get answers error:', error);
    res.status(500).json({ error: 'Failed to get answers' });
  }
};

export const saveDateSelection = async (req: Request, res: Response) => {
  try {
    const { sessionId, selectedDate, selectedTime, dateAccepted, promiseChecklist, loveMeterValue, excitementLevel } = req.body;

    const existing = await DateSelection.findOne({ sessionId });
    if (existing) {
      Object.assign(existing, { selectedDate, selectedTime, dateAccepted, promiseChecklist, loveMeterValue, excitementLevel });
      await existing.save();
      return res.json({ message: 'Date selection updated', dateSelection: existing });
    }

    const dateSelection = new DateSelection({
      sessionId, selectedDate, selectedTime, dateAccepted,
      promiseChecklist: promiseChecklist || [],
      loveMeterValue: loveMeterValue || 0,
      excitementLevel: excitementLevel || '',
    });

    await dateSelection.save();

    await UserSession.findOneAndUpdate(
      { sessionId },
      { $set: { dateAccepted: !!dateAccepted, completed: !!dateAccepted, completionPercentage: 100 } }
    );

    res.status(201).json({ message: 'Date selection saved', dateSelection });
  } catch (error) {
    console.error('Save date selection error:', error);
    res.status(500).json({ error: 'Failed to save date selection' });
  }
};

export const getDateSelection = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const selection = await DateSelection.findOne({ sessionId });
    if (!selection) return res.status(404).json({ error: 'Date selection not found' });
    res.json(selection);
  } catch (error) {
    console.error('Get date selection error:', error);
    res.status(500).json({ error: 'Failed to get date selection' });
  }
};
