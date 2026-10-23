/** Edge and Opera carry Chrome's token and Chrome carries Safari's, so the more specific family is matched first. */
const BROWSER_FAMILIES = [
  { family: 'Microsoft Edge', tokens: ['Edg'] },
  { family: 'Opera', tokens: ['OPR', 'Opera'] },
  { family: 'Firefox', tokens: ['Firefox'] },
  { family: 'Chrome', tokens: ['Chrome'] },
  { family: 'Safari', tokens: ['Safari'] },
] as const

type BrowserFamily = (typeof BROWSER_FAMILIES)[number]['family']

interface BrowserInfo {
  /** The browser's family read off the user agent, undefined where none is recognised. */
  browser: BrowserFamily | undefined
  platform: string
  language: string
  online: boolean
  cookiesEnabled: boolean
}

function detectBrowser(userAgent: string): BrowserFamily | undefined {
  return BROWSER_FAMILIES.find(({ tokens }) => tokens.some((token) => userAgent.includes(token)))?.family
}

/** What the browser says of itself, read once per render. */
export function useBrowserInfo(): BrowserInfo {
  return {
    browser: detectBrowser(navigator.userAgent),
    platform: navigator.platform,
    language: navigator.language,
    online: navigator.onLine,
    cookiesEnabled: navigator.cookieEnabled,
  }
}
