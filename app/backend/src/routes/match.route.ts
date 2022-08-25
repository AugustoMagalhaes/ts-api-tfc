import { Router } from 'express';
import MatchController from '../controllers/match.controller';

const router = Router();

router.get('/', MatchController.getAllTeams);
router.post('/', MatchController.createMatch);

export default router;
