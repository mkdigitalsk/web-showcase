import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import { defineConfig, globalIgnores } from 'eslint/config'

/** [React Router — Route Module](https://reactrouter.com/start/framework/route-module) */
const ROUTE_MODULE_EXPORTS = [
  'clientLoader',
  'clientAction',
  'clientMiddleware',
  'handle',
  'links',
  'meta',
  'shouldRevalidate',
]

/** Its peer range stops at ESLint 9; package.json overrides it, and the rules run unchanged on 10. */
const jsxA11yRecommended = jsxA11y.flatConfigs.recommended

export default defineConfig([
  globalIgnores(['build', '.react-router', '.claude']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11yRecommended,
    ],
    languageOptions: {
      globals: globals.browser,
      /** Type-aware linting: without it the any ban and every no-unsafe-* rule silently pass. */
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      /**
       * A route module exports what React Router names beside its component, and the framework keeps those
       * exports out of Fast Refresh's way itself.
       */
      'react-refresh/only-export-components': [
        'error',
        { allowConstantExport: true, allowExportNames: ROUTE_MODULE_EXPORTS },
      ],
      /**
       * A path written as a literal agrees with routes.ts only until one of them changes, and the
       * disagreement surfaces as a link to a route the router never registered. A `<link href>` names a
       * file the document loads, never a route, so the rule passes it.
       */
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "JSXOpeningElement[name.name!='link'] > JSXAttribute[name.name=/^(to|path|href)$/] > Literal[value=/^\\//]",
          message: 'Use a Routes constant from src/utils/routes.ts, never a path literal.',
        },
        {
          selector: 'CallExpression[callee.name="navigate"] > Literal[value=/^\\//]',
          message: 'Use a Routes constant from src/utils/routes.ts, never a path literal.',
        },
      ],
    },
  },
  /** routes.ts is where the literals are declared, so the rule cannot apply to it. */
  { files: ['src/utils/routes.ts'], rules: { 'no-restricted-syntax': 'off' } },
  eslintConfigPrettier,
])
