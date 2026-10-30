/** What each event of a Vercel script passes through before it leaves. */
export type BeforeSend = (event: { type: string; url: string; route?: string }) => unknown

/** The `beforeSend` a Vercel script's queue holds for the script, which reads the queue once it loads. */
export function beforeSendIn(queue: readonly (readonly [string, unknown?])[] | undefined): BeforeSend | undefined {
  const held = queue?.find(([name]) => name === 'beforeSend')?.[1]
  return typeof held === 'function' ? (held as BeforeSend) : undefined
}

/** Forgets what Vercel's two scripts left behind — the queues their packages declare on `Window`, and the scripts. */
export function forgetVercelScripts(): void {
  delete window.va
  delete window.vaq
  delete window.si
  delete window.siq
  document.head.querySelectorAll('script').forEach((script) => script.remove())
}
