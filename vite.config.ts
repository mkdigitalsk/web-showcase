import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import react from '@vitejs/plugin-react'
import type { InlineConfig } from 'vitest/node'
import { apiProxy } from './server/viteApiProxy'

/**
 * `test` typed via vitest's own InlineConfig, `plugins` via vite's UserConfig — keeps them apart so
 * vitest's bundled-vite types don't clash with vite 8 (rolldown).
 */
type Config = UserConfig & { test: InlineConfig }

/**
 * The config runs in Node, where Vite has not populated process.env from the .env files — loadEnv is
 * what reads them, so it is also what lets a gitignored .env file override anything below. The empty
 * prefix is deliberate: these names carry no VITE_, and only what `define` injects reaches the bundle.
 */
const loadUnprefixedEnv = (mode: string) => loadEnv(mode, process.cwd(), '')

/** Vitest loads this config as `serve` in mode `test`, and starts no dev server. */
const isVitest = ({ mode }: ConfigEnv) => mode === 'test'

/**
 * Under Vitest the React plugin compiles the components and nothing else runs: React Router's plugin serves
 * and builds an app, and a test renders modules one by one.
 */
function pluginsFor(configEnv: ConfigEnv, env: Record<string, string>) {
  if (isVitest(configEnv)) return [react()]
  return [apiProxy(env.API_URL), reactRouter()]
}

// https://vite.dev/config/
export default defineConfig((configEnv): Config => {
  const env = loadUnprefixedEnv(configEnv.mode)

  return {
    plugins: pluginsFor(configEnv, env),
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.0.0'),
    },
    ssr: {
      /**
       * The build renders the root once in Node to write `index.html`. MUI's ESM files import
       * react-transition-group by directory, which Node's loader refuses, so both are bundled into that render
       * the way the browser build bundles them.
       */
      noExternal: [/^@mui\//, 'react-transition-group'],
    },
    test: {
      environment: 'jsdom',
      /**
       * Node ≥25 ships its own Web Storage globals (inert without --localstorage-file) and the test
       * worker keeps them over jsdom's, so every localStorage call fails. The flag hands the globals
       * back to jsdom. It exists only since Node 22.4 — an older node rejects it as a bad option, so it
       * is version-guarded rather than unconditional.
       */
      execArgv: Number(process.versions.node.split('.')[0]) >= 23 ? ['--no-experimental-webstorage'] : [],
      globals: true,
      /**
       * The 5s default is tuned for unit tests. Ours are integration tests that type through real MUI
       * re-renders into a live Dexie query, which alone spends seconds before anything is asserted.
       */
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
