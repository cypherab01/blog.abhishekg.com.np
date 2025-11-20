import * as z from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .regex(/^[a-z0-9]+$/, {
      message: "Username must contain only letters and numbers",
    })
    .transform((val) => val.trim().toLowerCase()),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
