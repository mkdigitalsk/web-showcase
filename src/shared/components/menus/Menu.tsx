import type { ReactElement, ReactNode } from 'react'
import { Menu as BaseMenu } from '@base-ui/react/menu'
import { Link } from 'react-router'
import type { AppRoute } from '../../../utils'
import { cx } from '../css'
import styles from './Menu.module.css'

interface MenuProps {
  /** The control that opens it. */
  trigger: ReactElement<Record<string, unknown>>
  align?: 'start' | 'end'
  /** Held by the caller where an item's own work closes the list — a save that may fail. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

/** A list of actions under a control. It opens, closes and moves the focus by itself. */
export function Menu({ trigger, align = 'end', open, onOpenChange, children }: MenuProps) {
  return (
    <BaseMenu.Root open={open} onOpenChange={onOpenChange}>
      <BaseMenu.Trigger render={trigger} />
      <BaseMenu.Portal>
        <BaseMenu.Positioner side="bottom" align={align} sideOffset={4}>
          <BaseMenu.Popup className={styles.popup}>{children}</BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  )
}

interface MenuItemProps extends Omit<BaseMenu.Item.Props, 'className'> {
  /** The item that is the current choice, where the list is one. */
  selected?: boolean
  className?: string
}

export function MenuItem({ selected = false, className, ...props }: MenuItemProps) {
  return <BaseMenu.Item className={cx(styles.item, className)} data-selected={selected || undefined} {...props} />
}

interface MenuLinkItemProps extends Omit<BaseMenu.LinkItem.Props, 'className' | 'render'> {
  to: AppRoute
  className?: string
}

export function MenuLinkItem({ to, className, ...props }: MenuLinkItemProps) {
  return <BaseMenu.LinkItem render={<Link to={to} />} className={cx(styles.item, className)} {...props} />
}

export function MenuSeparator() {
  return <BaseMenu.Separator className={styles.separator} />
}
