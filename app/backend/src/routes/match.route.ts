import { Router } from 'express';
import MatchController from '../controllers/match.controller';

const router = Router();

router.get('/', MatchController.getAllMatches);
router.post('/', MatchController.createMatch);
router.patch('/:id', MatchController.changeMatchScore);
router.patch('/:id/finish', MatchController.finishMatch);

export default router;
