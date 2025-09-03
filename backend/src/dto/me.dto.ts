import { z } from "zod";

export const UpdateMeDto = z.object({
  displayName: z.string().min(1).max(100).optional(),
  photoURL: z.string().url().optional(),
  preferences: z
    .object({
      theme: z.enum(["light", "dark"]).optional(),
      language: z.string().min(2).max(10).optional(),
    })
    .optional(),
});
