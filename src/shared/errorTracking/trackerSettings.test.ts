import { describe, expect, it } from 'vitest'
import { trackerSettingsOf } from './trackerSettings'

const DSN = 'https://public@tracker.example.com/1'

describe('the tracker an environment names', () => {
  it('is the project its DSN names, under the environment Vercel builds for', () => {
    expect(trackerSettingsOf({ SENTRY_DSN: DSN, VERCEL_ENV: 'preview' })).toEqual({
      dsn: DSN,
      environment: 'preview',
    })
  })

  it('is filed under development off Vercel', () => {
    expect(trackerSettingsOf({ SENTRY_DSN: DSN })?.environment).toBe('development')
  })

  it.each([{}, { SENTRY_DSN: '' }, { SENTRY_DSN: '   ' }])('is none while the DSN is blank — %o', (environment) => {
    expect(trackerSettingsOf(environment)).toBeUndefined()
  })

  it.each([
    'tracker.example.com/1',
    'ftp://public@tracker.example.com/1',
    'https://tracker.example.com/1',
    'https://public@tracker.example.com/',
  ])('stops the build on a DSN with no scheme of the web, key or project — %s', (malformed) => {
    expect(() => trackerSettingsOf({ SENTRY_DSN: malformed })).toThrow('SENTRY_DSN is malformed')
  })
})
