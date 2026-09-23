import { useState } from 'react'

/** Result of attempting to show a notification — the page maps this to localized UI. */
export type NotifyOutcome = 'shown' | 'denied' | 'unsupported'

interface UseNotificationResult {
  isSupported: boolean
  permission: NotificationPermission
  notify: (title: string, body?: string) => Promise<NotifyOutcome>
}

/** Asks only while the person has not decided — a denied permission is never re-prompted. */
async function askIfUndecided(onAsked: (answer: NotificationPermission) => void): Promise<NotificationPermission> {
  if (Notification.permission !== 'default') return Notification.permission
  const answer = await Notification.requestPermission()
  onAsked(answer)
  return answer
}

/**
 * Wraps the browser Notification API behind a stable interface (Dependency Inversion):
 * components depend on `notify` / `permission`, never on the raw `Notification` global.
 */
export function useNotification(): UseNotificationResult {
  const isSupported = typeof window !== 'undefined' && 'Notification' in window
  const [permission, setPermission] = useState<NotificationPermission>(isSupported ? Notification.permission : 'denied')

  const notify = async (title: string, body?: string): Promise<NotifyOutcome> => {
    if (!isSupported) return 'unsupported'
    const current = await askIfUndecided(setPermission)
    if (current !== 'granted') return 'denied'
    new Notification(title, body ? { body } : undefined)
    return 'shown'
  }

  return { isSupported, permission, notify }
}
