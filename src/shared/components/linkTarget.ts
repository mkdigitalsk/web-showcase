import type { AppRoute } from '../../utils'

/** A route of this app, or an address elsewhere — the second opens in a new tab. */
export type LinkTarget = { to: AppRoute; href?: never } | { href: string; to?: never }
