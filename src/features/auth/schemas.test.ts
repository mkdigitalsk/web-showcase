import { describe, it, expect } from 'vitest'
import { signInSchema, signUpSchema } from './schemas'

describe('signInSchema', () => {
  it('accepts a valid email and non-empty password', () => {
    expect(signInSchema.safeParse({ email: 'a@b.com', password: 'pw' }).success).toBe(true)
  })

  it('reports the i18n key for a malformed email', () => {
    const result = signInSchema.safeParse({ email: 'not-an-email', password: 'pw' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('invalidEmail')
  })

  it('reports the required key for an empty password', () => {
    const result = signInSchema.safeParse({ email: 'a@b.com', password: '' })
    expect(result.error?.issues[0]?.message).toBe('required')
  })
})

describe('signUpSchema', () => {
  it('rejects a password shorter than six characters', () => {
    const result = signUpSchema.safeParse({ name: 'Al', email: 'a@b.com', password: '123' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('passwordTooShort')
  })
})
