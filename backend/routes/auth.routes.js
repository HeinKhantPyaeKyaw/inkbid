import { Router } from 'express';
import { login, register } from '../controller/auth.controller.js';
import { verifyAuth } from '../middlewares/auth.middleware.js';

const authRouter = Router();
authRouter.post('/register', register);
authRouter.post('/login', login);

// Test route with protected
authRouter.get('/protected', verifyAuth, (req, res) => {
  res.json({
    message: 'You are logged in!',
    user: req.user, // comes from middleware
  });
});

// Placeholder for log-out route
authRouter.post('/log-out', (req, res) => {
  res.send({ title: 'Log out' });
});

export default authRouter;
