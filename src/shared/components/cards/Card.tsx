import type { ComponentPropsWithoutRef } from 'react'
import { cx } from '../css'
import styles from './Card.module.css'

/** A pane on the ground — ruled by a hairline, no shadow. */
export function Card({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx(styles.card, className)} {...props} />
}
