import { Router } from "express";

const userRouter = Router();

userRouter.get('/users', (req, res) => {
  res.send({ title: "GET all users" });
});
userRouter.get("/users/:id", (req, res) => {
  res.send({ title: "GET user by ID" });
});
userRouter.post("/users", (req, res) => {
  res.send({ title: "CREATE new user" });
});
userRouter.put("/users/:id", (req, res) => {
  res.send({ title: "UPDATE user by ID" });
});
userRouter.delete("/users/:id", (req, res) => {
  res.send({ title: "DELETE user by ID" });
});

export default userRouter