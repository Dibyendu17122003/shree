import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getDashboardStats,
  getAllAnswers,
  getAnalyticsData,
  searchSessions,
  deleteSession,
  exportData,
} from '../controllers/analyticsController';

const router = Router();

router.use(authenticate);

router.get('/stats', getDashboardStats);
router.get('/answers', getAllAnswers);
router.get('/charts', getAnalyticsData);
router.get('/search', searchSessions);
router.delete('/session/:sessionId', deleteSession);
router.get('/export', exportData);

export default router;
