import { defineConfig, loadEnv, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { InlineConfig } from 'vitest/node'

const DEFAULT_API = 'https://api.showcase.mkdigital.sk'

// `test` typed via vitest's own InlineConfig, `plugins` via vite's UserConfig —
// keeps them apart so vitest's bundled-vite types don't clash with vite 8 (rolldown).
type Config = UserConfig & { test: InlineConfig }

// https://vite.dev/config/
export default defineConfig(({ command, mode }): Config => {
  // Config runs in Node, where Vite has not populated process.env from the .env files — loadEnv is what
  // reads them, so it is also what lets a gitignored .env file override anything below. The empty prefix
  // is deliberate: these names carry no VITE_, and only what `define` injects reaches the bundle.
  const env = loadEnv(mode, process.cwd(), '')

  // A build has no dev server and so no proxy: without a base URL every call would resolve against the
  // static host. Failing here keeps that deploy from shipping as 404s in the browser.
  if (command === 'build' && !env.API_URL) {
    throw new Error('API_URL is required for a production build')
  }

  return {
    plugins: [react()],
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.0.0'),
      // Empty in dev and under test, where requests stay same-origin — the proxy below carries them.
      __API_URL__: JSON.stringify(env.API_URL ?? ''),
    },
    server: {
      proxy: {
        // The dev server forwards the API rather than the browser calling it: a cross-origin call would
        // need the API to allow-list a localhost origin, which is a production trust decision made for a
        // development convenience. Same-origin here costs nothing and grants nothing.
        '/v1': {
          target: env.API_PROXY_TARGET || DEFAULT_API,
          changeOrigin: true,
          // The hop is server-to-server, so the browser's origin must not travel with it — the API
          // rejects every request carrying an origin outside its allow-list, preflight or not.
          configure: (proxy) => proxy.on('proxyReq', (proxyReq) => proxyReq.removeHeader('origin')),
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      // The 5s default is tuned for unit tests. Ours are integration tests that type through real MUI
      // re-renders into a live Dexie query, which alone spends seconds before anything is asserted.
      testTimeout: 15000,
      setupFiles: ['./src/test/setup.ts'],
      deps: {
        optimizer: {
          client: { enabled: true, include: ['@mui/material', '@mui/icons-material', 'react-transition-group'] },
        },
      },
    },
  }
})
