import type { ReactElement, ReactNode } from 'react'
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'
import styles from './Tooltip.module.css'

/** How long the pointer rests before a tip opens — a tool's controls are hovered on purpose, so briefly. */
const OPEN_DELAY = 300

/** The one provider every tip shares — once, at the root — so moving between controls carries the open state over. */
export function TooltipProvider({ children }: { children: ReactNode }) {
  return <BaseTooltip.Provider delay={OPEN_DELAY}>{children}</BaseTooltip.Provider>
}

interface TooltipProps {
  title: ReactNode
  /** The control the tip describes. */
  children: ReactElement<Record<string, unknown>>
  side?: 'top' | 'bottom' | 'left' | 'right'
}

/**
 * A hint for the sighted, shown on hover and focus. It names nothing for a reader — the control's own label does
 * that — so a glyph-only control still carries its `aria-label`.
 */
export function Tooltip({ title, children, side = 'top' }: TooltipProps) {
  if (!title) return children

  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={6}>
          <BaseTooltip.Popup className={styles.popup}>{title}</BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  )
}
