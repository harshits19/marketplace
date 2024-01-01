import { z } from "zod"

export const AuthCredentialsValidator = z.object({
  username: z.string().min(3).max(25).optional(),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
})

export type TAuthCredentialsValidator = z.infer<typeof AuthCredentialsValidator>
