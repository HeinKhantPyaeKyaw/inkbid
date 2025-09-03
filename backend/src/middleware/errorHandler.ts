import { ErrorRequestHandler } from "express";
import { AppError } from "../utils/appError"; // note: file name casing

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message, details: err.details });
    return; // ensure return type is void
  }
  console.error("[unhandled]", err);
  res.status(500).json({ error: "Internal Server Error" });
};
