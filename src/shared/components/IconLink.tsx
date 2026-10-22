import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { cx } from './css'
import type { LinkTarget } from './linkTarget'
import styles from './IconLink.module.css'

interface IconLinkBaseProps {
  /** Where it leads, since the glyph says nothing to a screen reader. */
  'aria-label': string
  size?: 'small' | 'medium'
  className?: string
  children: ReactNode
}

type IconLinkProps = IconLinkBaseProps & LinkTarget

/** An `IconButton` that goes somewhere — a link, so it reads as one. */
export function IconLink({ to, href, size = 'medium', className, children, ...props }: IconLinkProps) {
  const linkClass = cx(styles.link, className)
  if (to === undefined) {
    return (
      <a href={href} target="_blank" rel="noopener" className={linkClass} data-size={size} {...props}>
        {children}
      </a>
    )
  }

  return (
    <Link to={to} className={linkClass} data-size={size} {...props}>
      {children}
    </Link>
  )
}
