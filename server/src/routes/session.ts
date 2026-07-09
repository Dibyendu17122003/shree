import { Router } from 'express';
import { createSession, trackVisit, updateSessionCompletion, getSession } from '../controllers/sessionController';

const router = Router();

router.post('/create', createSession);
router.post('/track', trackVisit);
router.put('/update', updateSessionCompletion);
router.get('/:sessionId', getSession);

export default router;
