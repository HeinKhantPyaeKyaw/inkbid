import { Router } from "express";
<<<<<<< HEAD
import { login, register } from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.post("/log-out", (req, res) => {
  res.send({ title: "Log out" });
});

=======
import {
  getMe,
  login,
  logout,
  updatePassword,
  register,
} from "../controller/auth.controller.js";
import { verifyAuth } from "../middlewares/auth.middleware.js";

const authRouter = Router();
authRouter.post("/register", register);
authRouter.post("/login", login);

authRouter.get("/protected", verifyAuth, (req, res) => {
  res.json({
    message: "You are logged in!",
    user: req.user,
  });
});

authRouter.get("/me", verifyAuth, getMe);
authRouter.put("/update-password", verifyAuth, updatePassword);

authRouter.post("/log-out", logout);

>>>>>>> 🐽TestMerge
export default authRouter;
