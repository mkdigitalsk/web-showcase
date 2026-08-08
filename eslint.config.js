import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
// Its peer range stops at ESLint 9; package.json overrides it, the rules run unchanged on 10.
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
      // Type-aware linting: without it the any ban and every no-unsafe-* rule silently pass.
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  // Last: turn off ESLint stylistic rules that would fight Prettier (formatting is Prettier's job).
  eslintConfigPrettier,
])
