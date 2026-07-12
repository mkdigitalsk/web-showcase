import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from './schemas'

describe('loginSchema', () => {
  it('accepts a valid email and non-empty password', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'pw' }).success).toBe(true)
  })

  it('reports the i18n key for a malformed email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'pw' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('invalidEmail')
  })

  it('reports the required key for an empty password', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: '' })
    expect(result.error?.issues[0]?.message).toBe('required')
  })
})

describe('registerSchema', () => {
  it('rejects a password shorter than six characters', () => {
    const result = registerSchema.safeParse({ name: 'Al', email: 'a@b.com', password: '123' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('passwordTooShort')
  })
})
