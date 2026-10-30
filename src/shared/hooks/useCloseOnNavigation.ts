import { useEffect, useEffectEvent } from 'react'
import { useLocation } from 'react-router'

/**
 * Closes an overlay when the page under it changes — a link followed from it, or a step Back or Forward — since an
 * overlay never outlives its page.
 */
export function useCloseOnNavigation(open: boolean, close: () => void) {
  const { key } = useLocation()
  const closeIfOpen = useEffectEvent(() => {
    if (open) close()
  })

  useEffect(() => closeIfOpen(), [key])
}
