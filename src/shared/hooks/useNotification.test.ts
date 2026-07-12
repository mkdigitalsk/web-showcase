import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useNotification } from './useNotification'

function stubNotification(permission: NotificationPermission, requestResult: NotificationPermission = permission) {
  const ctor = vi.fn()
  class MockNotification {
    static permission = permission
    static requestPermission = vi.fn().mockResolvedValue(requestResult)
    constructor(title: string, options?: NotificationOptions) {
      ctor(title, options)
    }
  }
  vi.stubGlobal('Notification', MockNotification)
  return { ctor, requestPermission: MockNotification.requestPermission }
}

afterEach(() => vi.unstubAllGlobals())

describe('useNotification', () => {
  it('reports unsupported when the Notification API is absent', async () => {
    Reflect.deleteProperty(globalThis, 'Notification') // jsdom lacks it; ensure no prior stub lingers
    const { result } = renderHook(() => useNotification())

    expect(result.current.isSupported).toBe(false)
    await expect(result.current.notify('Hi')).resolves.toBe('unsupported')
  })

  it('shows a notification when permission is already granted', async () => {
    const { ctor, requestPermission } = stubNotification('granted')
    const { result } = renderHook(() => useNotification())

    let outcome
    await act(async () => {
      outcome = await result.current.notify('Hi', 'there')
    })

    expect(outcome).toBe('shown')
    expect(ctor).toHaveBeenCalledWith('Hi', { body: 'there' })
    expect(requestPermission).not.toHaveBeenCalled()
  })

  it('returns denied without constructing a notification when permission is denied', async () => {
    const { ctor } = stubNotification('denied')
    const { result } = renderHook(() => useNotification())

    let outcome
    await act(async () => {
      outcome = await result.current.notify('Hi')
    })

    expect(outcome).toBe('denied')
    expect(ctor).not.toHaveBeenCalled()
  })

  it('requests permission when undecided and shows on grant', async () => {
    const { ctor, requestPermission } = stubNotification('default', 'granted')
    const { result } = renderHook(() => useNotification())

    let outcome
    await act(async () => {
      outcome = await result.current.notify('Hi')
    })

    expect(requestPermission).toHaveBeenCalledOnce()
    expect(outcome).toBe('shown')
    expect(ctor).toHaveBeenCalledOnce()
    expect(result.current.permission).toBe('granted')
  })
})
