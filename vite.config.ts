import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { InlineConfig } from 'vitest/node'

// `test` typed via vitest's own InlineConfig, `plugins` via vite's UserConfig —
// keeps them apart so vitest's bundled-vite types don't clash with vite 8 (rolldown).
const config: UserConfig & { test: InlineConfig } = {
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.0.0'),
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    server: {
      // @mui/material's ESM does a directory import of react-transition-group that
      // Node can't externalise-resolve; inlining lets vite resolve it.
      deps: { inline: [/@mui\//, 'react-transition-group'] },
    },
  },
}

// https://vite.dev/config/
export default defineConfig(config)
