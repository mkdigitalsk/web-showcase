import type { CSSProperties } from 'react'

/** Joins the class names that are set — a module's class, a state's, the caller's. */
export function cx(...names: ReadonlyArray<string | false | undefined>): string {
  return names.filter(Boolean).join(' ')
}

/** A runtime value handed to a module as a custom property — the one thing an inline style carries. */
export function cssVars(vars: Record<`--${string}`, string | number>): CSSProperties {
  return vars
}
