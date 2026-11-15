import { z } from "zod";

export const authEmailSchema = z
  .email({
    pattern: z.regexes.unicodeEmail,
    error: "Please provide a valid email",
  })
  .max(255, "Email must be at most 255 characters");
