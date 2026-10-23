import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { DeleteIcon, LanguageIcon } from './catalog'
import { Icon } from './Icon'

const glyphOf = (container: HTMLElement): SVGElement => {
  const glyph = container.querySelector('svg')
  if (!glyph) throw new Error('no glyph drawn')
  return glyph
}

describe('Icon', () => {
  it('draws the glyph at the middle of the scale, hidden from a screen reader', () => {
    const { container } = render(<Icon glyph={DeleteIcon} />)

    expect(glyphOf(container)).toHaveAttribute('data-size', 'medium')
    expect(glyphOf(container)).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws the glyph at the size asked for, keeping the caller’s class', () => {
    const { container } = render(<Icon glyph={LanguageIcon} size="inherit" className="mark" />)

    expect(glyphOf(container)).toHaveAttribute('data-size', 'inherit')
    expect(glyphOf(container)).toHaveClass('mark')
  })
})
