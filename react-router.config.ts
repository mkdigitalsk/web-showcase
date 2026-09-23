import type { Config } from '@react-router/dev/config'

/**
 * SPA mode: the root renders once at build time into `index.html` and every path is served from it — there is
 * no server to render on ([React Router — SPA](https://reactrouter.com/how-to/spa)).
 */
export default {
  appDirectory: 'src',
  ssr: false,
} satisfies Config
