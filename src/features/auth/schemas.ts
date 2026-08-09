import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().min(1, { error: 'required' }).email({ error: 'invalidEmail' }),
  password: z.string().min(1, { error: 'required' }),
})

export type SignInFormData = z.infer<typeof signInSchema>

export const signUpSchema = z.object({
  name: z.string().min(1, { error: 'required' }),
  email: z.string().min(1, { error: 'required' }).email({ error: 'invalidEmail' }),
  password: z.string().min(6, { error: 'passwordTooShort' }),
})

export type SignUpFormData = z.infer<typeof signUpSchema>
