import { Router } from 'express';
import { login, checkAuth } from '../controllers/adminController';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', authLimiter, login);
router.get('/check', authenticate, checkAuth);

export default router;
