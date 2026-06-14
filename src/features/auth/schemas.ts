import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, { error: 'required' }).email({ error: 'invalidEmail' }),
  password: z.string().min(1, { error: 'required' }),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: z.string().min(1, { error: 'required' }),
  email: z.string().min(1, { error: 'required' }).email({ error: 'invalidEmail' }),
  password: z.string().min(6, { error: 'passwordTooShort' }),
})

export type RegisterFormData = z.infer<typeof registerSchema>
