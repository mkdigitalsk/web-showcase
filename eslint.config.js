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
    rules: {
      // A path written as a literal agrees with routes.ts only until one of them changes, and the
      // disagreement surfaces as a link to a route the router never registered.
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXAttribute[name.name=/^(to|path|href)$/] > Literal[value=/^\\//]',
          message: 'Use a Routes constant from src/utils/routes.ts, never a path literal.',
        },
        {
          selector: 'CallExpression[callee.name="navigate"] > Literal[value=/^\\//]',
          message: 'Use a Routes constant from src/utils/routes.ts, never a path literal.',
        },
      ],
    },
  },
  // routes.ts is where the literals are declared, so the rule cannot apply to it.
  { files: ['src/utils/routes.ts'], rules: { 'no-restricted-syntax': 'off' } },
  // Last: turn off ESLint stylistic rules that would fight Prettier (formatting is Prettier's job).
  eslintConfigPrettier,
])
