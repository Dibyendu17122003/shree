import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import UserSession from '../models/UserSession';
import QuestionAnswer from '../models/QuestionAnswer';
import VisitAnalytics from '../models/VisitAnalytics';
import DateSelection from '../models/DateSelection';

export const getDashboardStats = async (_req: AuthRequest, res: Response) => {
  try {
    const totalVisits = await UserSession.countDocuments();
    const completedSessions = await UserSession.countDocuments({ completed: true });
    const dateAccepted = await UserSession.countDocuments({ dateAccepted: true });
    const currentVisitors = await UserSession.countDocuments({
      endTime: null,
      startTime: { $gte: new Date(Date.now() - 30 * 60 * 1000) }
    });

    const sessions = await UserSession.find({ completionPercentage: { $gt: 0 } });
    const avgCompletion = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.completionPercentage, 0) / sessions.length
      : 0;

    const totalTimeResult = await UserSession.aggregate([
      { $group: { _id: null, total: { $sum: '$totalTimeSpent' } } }
    ]);
    const avgTime = totalTimeResult.length > 0
      ? Math.round(totalTimeResult[0].total / (totalVisits || 1))
      : 0;

    res.json({
      totalVisits,
      completedSessions,
      currentVisitors,
      dateAccepted,
      avgCompletion: Math.round(avgCompletion * 100) / 100,
      avgTime,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
};

export const getAllAnswers = async (_req: AuthRequest, res: Response) => {
  try {
    const sessions = await UserSession.find({ dateAccepted: true }).sort({ startTime: -1 }).limit(50);
    const completedIds = sessions.map(s => s.sessionId);

    const answerGroups = await QuestionAnswer.aggregate([
      { $match: { sessionId: { $in: completedIds } } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$sessionId',
          answers: { $push: '$$ROOT' },
          latestTimestamp: { $max: '$timestamp' },
        }
      },
      { $sort: { latestTimestamp: -1 } },
    ]);

    const sessionMap = new Map(sessions.map(s => [s.sessionId, s]));

    const result = answerGroups.map((group: any) => {
      const session = sessionMap.get(group._id);
      const answerMap: Record<string, string> = {};
      group.answers.forEach((a: any) => {
        answerMap[a.questionKey] = a.answer;
      });
      return {
        sessionId: group._id,
        session: session ? {
          browser: session.browser,
          device: session.device,
          os: session.os,
          completed: session.completed,
          dateAccepted: session.dateAccepted,
          startTime: session.startTime,
          completionPercentage: session.completionPercentage,
        } : null,
        answers: answerMap,
        timestamp: group.latestTimestamp,
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Get all answers error:', error);
    res.status(500).json({ error: 'Failed to get answers' });
  }
};

export const getAnalyticsData = async (_req: AuthRequest, res: Response) => {
  try {
    const foodAnswers = await QuestionAnswer.aggregate([
      { $match: { questionKey: 'food' } },
      { $group: { _id: '$answer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const locationAnswers = await QuestionAnswer.aggregate([
      { $match: { questionKey: 'location' } },
      { $group: { _id: '$answer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const dailyVisits = await VisitAnalytics.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 },
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    const deviceStats = await UserSession.aggregate([
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const browserStats = await UserSession.aggregate([
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      foodChoices: foodAnswers,
      locationChoices: locationAnswers,
      dailyVisits,
      deviceStats,
      browserStats,
    });
  } catch (error) {
    console.error('Analytics data error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
};

export const searchSessions = async (req: AuthRequest, res: Response) => {
  try {
    const { query, accepted, startDate, endDate } = req.query;
    const filter: any = {};

    if (query) {
      filter.$or = [
        { sessionId: { $regex: query, $options: 'i' } },
        { browser: { $regex: query, $options: 'i' } },
        { device: { $regex: query, $options: 'i' } },
      ];
    }
    if (accepted === 'true') filter.dateAccepted = true;
    if (accepted === 'false') filter.dateAccepted = false;
    if (startDate) filter.startTime = { $gte: new Date(startDate as string) };
    if (endDate) {
      filter.startTime = { ...filter.startTime, $lte: new Date(endDate as string) };
    }

    const sessions = await UserSession.find(filter).sort({ startTime: -1 }).limit(100);
    res.json(sessions);
  } catch (error) {
    console.error('Search sessions error:', error);
    res.status(500).json({ error: 'Failed to search sessions' });
  }
};

export const deleteSession = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    await Promise.all([
      UserSession.deleteOne({ sessionId }),
      QuestionAnswer.deleteMany({ sessionId }),
      VisitAnalytics.deleteMany({ sessionId }),
      DateSelection.deleteOne({ sessionId }),
    ]);
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
};

export const exportData = async (req: AuthRequest, res: Response) => {
  try {
    const { format } = req.query;
    const answers = await QuestionAnswer.find().sort({ timestamp: -1 }).limit(500);
    const sessions = await UserSession.find().sort({ startTime: -1 }).limit(500);
    const sessionMap = new Map(sessions.map(s => [s.sessionId, s]));

    const data = answers.map(a => {
      const session = sessionMap.get(a.sessionId);
      return {
        sessionId: a.sessionId,
        question: a.question,
        answer: a.answer,
        timeSpent: a.timeSpent,
        timestamp: a.timestamp,
        browser: session?.browser || '',
        device: session?.device || '',
        completed: session?.completed || false,
      };
    });

    if (format === 'csv') {
      const headers = 'Session ID,Question,Answer,Time Spent (s),Timestamp,Browser,Device,Completed\n';
      const rows = data.map(d =>
        `"${d.sessionId}","${d.question}","${d.answer}",${d.timeSpent},"${d.timestamp}", "${d.browser}","${d.device}",${d.completed}`
      ).join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=date-proposal-data.csv');
      return res.send(headers + rows);
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=date-proposal-data.json');
    res.json(data);
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
};
