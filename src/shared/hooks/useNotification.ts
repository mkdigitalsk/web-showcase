import { useState } from 'react'

/** Result of attempting to show a notification — the page maps this to localized UI. */
export type NotifyOutcome = 'shown' | 'denied' | 'unsupported'

interface UseNotificationResult {
  isSupported: boolean
  permission: NotificationPermission
  notify: (title: string, body?: string) => Promise<NotifyOutcome>
}

/**
 * Wraps the browser Notification API behind a stable interface (Dependency Inversion):
 * components depend on `notify` / `permission`, never on the raw `Notification` global.
 */
export function useNotification(): UseNotificationResult {
  const isSupported = typeof window !== 'undefined' && 'Notification' in window
  const [permission, setPermission] = useState<NotificationPermission>(
    isSupported ? Notification.permission : 'denied',
  )

  const notify = async (title: string, body?: string): Promise<NotifyOutcome> => {
    if (!isSupported) return 'unsupported'
    // Ask only if the user hasn't decided yet — never re-prompt a denied user.
    let current = Notification.permission
    if (current === 'default') {
      current = await Notification.requestPermission()
      setPermission(current)
    }
    if (current !== 'granted') return 'denied'
    new Notification(title, body ? { body } : undefined)
    return 'shown'
  }

  return { isSupported, permission, notify }
}
