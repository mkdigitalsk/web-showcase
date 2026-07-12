import { describe, it, expect, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

afterEach(() => localStorage.clear())

describe('useLocalStorage', () => {
  it('returns the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0))

    expect(result.current[0]).toBe(0)
  })

  it('hydrates from the stored value', () => {
    localStorage.setItem('count', '42')
    const { result } = renderHook(() => useLocalStorage('count', 0))

    expect(result.current[0]).toBe(42)
  })

  it('persists a set value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0))

    act(() => result.current[1](5))

    expect(result.current[0]).toBe(5)
    expect(localStorage.getItem('count')).toBe('5')
  })

  it('supports a functional updater', () => {
    const { result } = renderHook(() => useLocalStorage('count', 1))

    act(() => result.current[1]((n) => n + 1))

    expect(result.current[0]).toBe(2)
  })

  it('removes the value and reverts to the initial', () => {
    localStorage.setItem('count', '9')
    const { result } = renderHook(() => useLocalStorage('count', 0))

    act(() => result.current[2]())

    expect(result.current[0]).toBe(0)
    expect(localStorage.getItem('count')).toBeNull()
  })

  it('falls back to the initial value on malformed JSON', () => {
    localStorage.setItem('count', '{not json')
    const { result } = renderHook(() => useLocalStorage('count', 7))

    expect(result.current[0]).toBe(7)
  })
})
