import { Router } from 'express';
import { saveAnswer, getAnswers, saveDateSelection, getDateSelection } from '../controllers/answerController';

const router = Router();

router.post('/save', saveAnswer);
router.get('/:sessionId', getAnswers);
router.post('/date-selection', saveDateSelection);
router.get('/date-selection/:sessionId', getDateSelection);

export default router;
