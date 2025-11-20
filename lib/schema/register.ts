import * as z from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .transform((val) => val.trim()),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .regex(/^[a-z0-9]+$/, {
      message: "Username must contain only letters and numbers",
    })
    .transform((val) => val.trim().toLowerCase()),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .transform((val) => val.trim()),
});

export type TRegisterSchema = z.infer<typeof registerSchema>;
