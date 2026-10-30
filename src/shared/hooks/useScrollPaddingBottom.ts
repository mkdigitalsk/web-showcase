import { useCallback, type RefCallback } from 'react'

/**
 * A ref that keeps the page's bottom scroll padding as tall as the element it is set on, for as long as it is
 * mounted — so a control taking keyboard focus scrolls clear of a bar pinned to the window's foot instead of
 * behind it.
 *
 * @see {@link https://www.w3.org/WAI/WCAG22/Techniques/css/C43 | WCAG 2.2 Technique C43 — Using CSS scroll-padding to un-obscure content}
 */
export function useScrollPaddingBottom(): RefCallback<HTMLElement> {
  return useCallback((element: HTMLElement | null) => {
    if (!element) return undefined
    const root = document.documentElement
    const observer = new ResizeObserver(() => {
      root.style.scrollPaddingBottom = `${element.getBoundingClientRect().height}px`
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
      root.style.removeProperty('scroll-padding-bottom')
    }
  }, [])
}
