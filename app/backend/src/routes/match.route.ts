import { Router } from 'express';
import MatchController from '../controllers/match.controller';

const router = Router();

router.get('/', MatchController.getAllTeams);
router.post('/', MatchController.createMatch);
router.patch('/:id/finish', MatchController.finishMatch);

export default router;
