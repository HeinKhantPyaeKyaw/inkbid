import { Router } from "express";
import { login, register } from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.post("/log-out", (req, res) => {
  res.send({ title: "Log out" });
});

export default authRouter;
