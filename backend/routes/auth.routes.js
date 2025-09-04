import {Router} from 'express'

const authRouter = Router();
authRouter.post('/sign-up', (req, res) => {
  res.send({title: 'Sign up'});
});
authRouter.post("/sign-in", (req, res) => {
  res.send({ title: "Sign in" });
});
authRouter.post("/log-out", (req, res) => {
  res.send({ title: "Log out" });
});

export default authRouter;