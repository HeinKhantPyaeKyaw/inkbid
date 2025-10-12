import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import errorMiddleware from './middlewares/error.middleware.js';
import articleRouter from './routes/article.routes.js';
import authRouter from './routes/auth.routes.js';
import bidsRouter from './routes/bid.routes.js';
import buyerRouter from './routes/buyer.routes.js';
import portfolioRouter from './routes/portfolio.routes.js';
import reviewRouter from './routes/reviews.routes.js';
import sellerProfileRouter from './routes/seller-profile.routes.js';
import sellerDashboardRouter from './routes/seller-dashboard.routes.js';
import notificationRouter from "./routes/notification.routes.js";
import userRouter from './routes/user.routes.js';
import contractRouter from './routes/contract.routes.js';
import notificationRoutes from "./routes/notification.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.use("/api/v1/payment/webhook", paymentRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/v1/payment", paymentRoutes);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/', articleRouter);
app.use('/api/v1/', bidsRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/seller-profile', sellerProfileRouter);
app.use('/api/v1/buyer', buyerRouter);
app.use('/api/v1/seller-dashboard', sellerDashboardRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use('/api/v1/contracts', contractRouter);
app.use('/api/v1/', portfolioRouter);
app.use(errorMiddleware);
app.use("/api/v1/notifications", notificationRoutes);

export default app;
