import { describe, it, expect, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useSessionStorage } from './useSessionStorage'

afterEach(() => sessionStorage.clear())

// Session-scoped twin of useLocalStorage — same contract, different backing store.
describe('useSessionStorage', () => {
  it('hydrates from and persists to sessionStorage', () => {
    sessionStorage.setItem('count', '3')
    const { result } = renderHook(() => useSessionStorage('count', 0))

    expect(result.current[0]).toBe(3)

    act(() => result.current[1]((n) => n + 1))

    expect(result.current[0]).toBe(4)
    expect(sessionStorage.getItem('count')).toBe('4')
  })

  it('removes the value and reverts to the initial', () => {
    sessionStorage.setItem('count', '9')
    const { result } = renderHook(() => useSessionStorage('count', 0))

    act(() => result.current[2]())

    expect(result.current[0]).toBe(0)
    expect(sessionStorage.getItem('count')).toBeNull()
  })
})
