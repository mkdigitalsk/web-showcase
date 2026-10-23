import { defineConfig } from '@playwright/test'

/** The preview's port — `scripts/run-e2e.sh` hands a pool place's own over, so two journeys run side by side. */
const PORT = process.env.E2E_WEB_PORT ?? '4173'

/**
 * The stack `scripts/run-e2e.sh` boots, never staging — no one else changes its data mid-run
 * ([Playwright — Testing with a database](https://playwright.dev/docs/best-practices#testing-with-a-database)).
 * ⚠ localhost by name, never 127.0.0.1 — the `__Host-` session cookie needs Secure, waived when localhost sets it
 * ([MDN — Set-Cookie, Secure](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#secure)).
 */
const BASE_URL = `http://localhost:${PORT}`

/**
 * `E2E_WATCH=1` opens the journey in a visible Chrome, slowed to a step a second, so a person can follow it. Off by
 * default — the journey is a check first.
 */
const WATCH = process.env.E2E_WATCH === '1'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list']],

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ...(WATCH && {
      headless: false,
      channel: 'chrome',
      viewport: null,
      launchOptions: { slowMo: 1000, args: ['--start-maximized'] },
    }),
  },

  /** The built app behind the same `/v1` proxy the edge runs; the script builds it first and passes API_URL. */
  webServer: {
    command: `npm run preview -- --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 60_000,
  },
})
