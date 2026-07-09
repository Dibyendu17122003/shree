import { Request, Response } from 'express';
import UserSession from '../models/UserSession';
import VisitAnalytics from '../models/VisitAnalytics';
import { v4 as uuidv4 } from 'uuid';
import { UAParser } from 'ua-parser-js';

export const createSession = async (req: Request, res: Response) => {
  try {
    const sessionId = uuidv4();
    const parser = new UAParser(req.headers['user-agent'] || '');
    const browser = parser.getBrowser().name || 'Unknown';
    const device = parser.getDevice().type || 'Desktop';
    const os = parser.getOS().name || 'Unknown';

    const session = new UserSession({
      sessionId,
      ip: req.ip || req.socket.remoteAddress || '',
      userAgent: req.headers['user-agent'] || '',
      browser,
      device,
      os,
      location: 'Unknown',
      city: 'Unknown',
      startTime: new Date(),
    });

    await session.save();
    res.status(201).json({ sessionId, message: 'Session created' });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
};

export const trackVisit = async (req: Request, res: Response) => {
  try {
    const { sessionId, page } = req.body;
    const parser = new UAParser(req.headers['user-agent'] || '');
    const browser = parser.getBrowser().name || 'Unknown';
    const device = parser.getDevice().type || 'Desktop';
    const os = parser.getOS().name || 'Unknown';

    const visit = new VisitAnalytics({
      sessionId,
      page,
      referrer: req.headers.referer || '',
      ip: req.ip || req.socket.remoteAddress || '',
      userAgent: req.headers['user-agent'] || '',
      browser,
      device,
      os,
      timestamp: new Date(),
    });

    await visit.save();
    res.status(201).json({ message: 'Visit tracked' });
  } catch (error) {
    console.error('Track visit error:', error);
    res.status(500).json({ error: 'Failed to track visit' });
  }
};

export const updateSessionCompletion = async (req: Request, res: Response) => {
  try {
    const { sessionId, completed, completionPercentage, totalTimeSpent } = req.body;

    const update: any = {};
    if (completed !== undefined) update.completed = completed;
    if (completionPercentage !== undefined) update.completionPercentage = completionPercentage;
    if (totalTimeSpent !== undefined) update.totalTimeSpent = totalTimeSpent;
    if (completed) update.endTime = new Date();

    const session = await UserSession.findOneAndUpdate(
      { sessionId },
      { $set: update },
      { new: true }
    );

    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json({ message: 'Session updated', session });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
};

export const getSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = await UserSession.findOne({ sessionId });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Failed to get session' });
  }
};
