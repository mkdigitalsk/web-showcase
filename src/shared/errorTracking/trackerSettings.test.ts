import { describe, expect, it } from 'vitest'
import { trackerSettingsIn, trackerSettingsOf } from './trackerSettings'

const DSN = 'https://public@tracker.example.com/1'

describe('the tracker an environment names', () => {
  it('is the project its DSN names, under the environment Vercel runs it in', () => {
    expect(trackerSettingsOf({ SENTRY_DSN: DSN, VERCEL_ENV: 'preview' })).toEqual({
      dsn: DSN,
      environment: 'preview',
    })
  })

  it('is filed under development off Vercel', () => {
    expect(trackerSettingsOf({ SENTRY_DSN: DSN })?.environment).toBe('development')
  })

  it('refuses an environment Vercel never names', () => {
    expect(() => trackerSettingsOf({ SENTRY_DSN: DSN, VERCEL_ENV: 'staging' })).toThrow('VERCEL_ENV is malformed')
  })

  it.each([{}, { SENTRY_DSN: '' }, { SENTRY_DSN: '   ' }])('is none while the DSN is blank — %o', (environment) => {
    expect(trackerSettingsOf(environment)).toBeUndefined()
  })

  it.each([
    'tracker.example.com/1',
    'ftp://public@tracker.example.com/1',
    'https://tracker.example.com/1',
    'https://public@tracker.example.com/',
  ])('refuses a DSN with no scheme of the web, key or project — %s', (malformed) => {
    expect(() => trackerSettingsOf({ SENTRY_DSN: malformed })).toThrow('SENTRY_DSN is malformed')
  })
})

describe('the tracker the edge tells the browser', () => {
  it('is the settings it served, parsed as their variables are', () => {
    expect(trackerSettingsIn({ dsn: DSN, environment: 'preview' })).toEqual({ dsn: DSN, environment: 'preview' })
  })

  it('is none where the edge named none', () => {
    expect(trackerSettingsIn(null)).toBeUndefined()
  })

  it.each([{}, { dsn: DSN }, { dsn: 1, environment: 'preview' }, 'tracker'])(
    'refuses an answer that holds no settings — %o',
    (answer) => {
      expect(() => trackerSettingsIn(answer)).toThrow('The tracker settings are malformed')
    },
  )
})
