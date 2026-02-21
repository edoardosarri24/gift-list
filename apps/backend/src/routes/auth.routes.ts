import { Router } from 'express';
import { register, login, refresh } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validate';
import { RegisterUserSchema, LoginUserSchema } from '@gift-list/shared';

const router = Router();

router.post('/register', validateBody(RegisterUserSchema), register);
router.post('/login', validateBody(LoginUserSchema), login);
router.post('/refresh', refresh);

// TODO: forgot-password, reset-password

export default router;
