import { z } from "zod";

export const RegisterDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  role: z.enum(["buyer", "writer"]),
});

export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
