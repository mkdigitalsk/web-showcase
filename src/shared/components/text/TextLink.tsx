import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { cx } from '../css'
import type { LinkTarget } from '../linkTarget'
import styles from './TextLink.module.css'

type TextLinkProps = { className?: string; children: ReactNode } & LinkTarget

export function TextLink({ to, href, className, children }: TextLinkProps) {
  const linkClass = cx(styles.link, className)
  if (to === undefined) {
    return (
      <a href={href} target="_blank" rel="noopener" className={linkClass}>
        {children}
      </a>
    )
  }

  return (
    <Link to={to} className={linkClass}>
      {children}
    </Link>
  )
}

export function TextLinkPrimary({ className, ...props }: TextLinkProps) {
  return <TextLink {...props} className={cx(styles.action, className)} />
}
