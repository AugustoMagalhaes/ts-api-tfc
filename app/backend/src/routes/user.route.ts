import { Router } from 'express';
import UserController from '../controllers/user.controller';

const router = Router();

router.get('/validate', UserController.validate);
router.post('/', UserController.login);

export default router;
