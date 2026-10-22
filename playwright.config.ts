import { defineConfig } from '@playwright/test'

/** The preview's port — `scripts/run-e2e.sh` hands a pool place's own over, so two journeys run side by side. */
const PORT = process.env.E2E_WEB_PORT ?? '4173'

/**
 * The journey runs against the stack `scripts/run-e2e.sh` boots — never staging: Playwright's own guidance is to test
 * an environment "and make sure it doesn't change". ⚠ localhost by name, not 127.0.0.1 — the session cookie is
 * `__Host-`, which requires Secure, and browsers grant that exemption to the name.
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
