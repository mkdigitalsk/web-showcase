/** Runs a vibration pattern on a device that has a motor. */
export function useVibration() {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator

  const vibrate = (pattern: number[]) => {
    if (!isSupported) return
    navigator.vibrate(pattern)
  }

  return { isSupported, vibrate }
}
