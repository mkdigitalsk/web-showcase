// Brand + scheme tokens come from the shared design system (@mkdigitalsk/design-system, generated
// from a single source). The logo stack (3-bar gradient) is composed locally from the primitives.
import { Brand, Light as DsLight, Dark as DsDark } from '@mkdigitalsk/design-system'

export { Brand }

export const Light = {
  ...DsLight,
  stack: [Brand.navy, Brand.blue, Brand.teal] as readonly string[],
}

export const Dark = {
  ...DsDark,
  stack: [Brand.white, Brand.blueLight, Brand.teal] as readonly string[],
}
