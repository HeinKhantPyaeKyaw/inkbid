import { ZodSchema } from "zod";
import { RequestHandler } from "express";

export function validate(schema: ZodSchema<any>, source: "body" | "query" = "body"): RequestHandler {
  return (req, res, next) => {
    const parsed = schema.safeParse((req as any)[source]);
    if (!parsed.success) {
      res.status(400).json({ errors: parsed.error.flatten() });
      return; // ensure return type is void
    }
    (req as any).validated = parsed.data;
    next();
  };
}
