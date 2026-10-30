import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

interface Header {
  readonly key: string
  readonly value: string
}

interface VercelConfig {
  readonly headers?: readonly { readonly source: string; readonly headers: readonly Header[] }[]
}

/** Vitest runs from the repo root, where the platform reads the file too. */
const config = JSON.parse(readFileSync(resolve('vercel.json'), 'utf8')) as VercelConfig

const headersFor = (path: string): Record<string, string> =>
  Object.fromEntries(
    (config.headers ?? [])
      .filter((rule) => new RegExp(`^${rule.source}$`).test(path))
      .flatMap((rule) => rule.headers.map((header) => [header.key, header.value])),
  )

/** The policy's directives by name, each with the sources it lists. */
const directivesOf = (policy: string): Record<string, string[]> =>
  Object.fromEntries(
    policy
      .split(';')
      .map((directive) => directive.trim().split(/\s+/))
      .filter(([name]) => name)
      .map(([name, ...sources]) => [name, sources]),
  )

/**
 * The platform serves the SPA, so its response headers are configuration rather than code — and a dropped one is
 * invisible in every other test. `X-Frame-Options` stays beside `frame-ancestors` for a browser that predates it.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options | MDN — X-Frame-Options}
 */
describe('the content security policy', () => {
  const pages = ['/', '/sign-up', '/privacy', '/networking', '/assets/index-abc123.js']

  it('rides on every response', () => {
    for (const path of pages) {
      expect(headersFor(path)['Content-Security-Policy'], path).toBeDefined()
      expect(headersFor(path)['X-Frame-Options'], path).toBe('DENY')
    }
  })

  it('names every directive the policy exists for, spelled out for a CSS-modules surface', () => {
    const policy = directivesOf(headersFor('/networking')['Content-Security-Policy'] ?? '')
    expect(policy['object-src']).toEqual(["'none'"])
    expect(policy['base-uri']).toEqual(["'self'"])
    expect(policy['form-action']).toEqual(["'self'"])
    expect(policy['frame-ancestors']).toEqual(["'none'"])
    expect(policy['upgrade-insecure-requests']).toEqual([])
    expect(policy['style-src-elem']).toEqual(["'self'", "'unsafe-inline'"])
    expect(policy['style-src-attr']).toEqual(["'unsafe-inline'"])
    expect(policy['style-src']).toBeUndefined()
  })

  it("runs this origin's scripts, Vercel's included, and calls only it and the tracker's EU ingest", () => {
    const policy = directivesOf(headersFor('/networking')['Content-Security-Policy'] ?? '')
    expect(policy['default-src']).toEqual(["'self'"])
    expect(policy['script-src']).toEqual(["'self'", "'unsafe-inline'"])
    expect(policy['connect-src']).toEqual(["'self'", 'https://*.ingest.de.sentry.io'])
  })
})
