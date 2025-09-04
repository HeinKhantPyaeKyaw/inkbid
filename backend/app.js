import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import articleRouter from "./routes/article.routes.js";
import bidsRouter from "./routes/bid.routes.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/", articleRouter); 
app.use("/api/v1/", bidsRouter);
app.use(errorMiddleware);

export default app;
