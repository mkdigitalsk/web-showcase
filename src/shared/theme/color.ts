import { Brand, Light as DsLight, Dark as DsDark } from '@mkdigitalsk/design-system'

export { Brand }

/** The design system's light scheme plus the logo's three-bar stack, composed here from its primitives. */
export const Light = {
  ...DsLight,
  stack: [Brand.navy, Brand.blue, Brand.teal] as const,
}

/** The design system's dark scheme plus the logo's three-bar stack, composed here from its primitives. */
export const Dark = {
  ...DsDark,
  stack: [Brand.white, Brand.blueLight, Brand.teal] as const,
}
