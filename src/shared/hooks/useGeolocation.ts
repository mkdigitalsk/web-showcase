export type LocateOutcome =
  | { kind: 'located'; latitude: number; longitude: number }
  | { kind: 'denied' }
  | { kind: 'unavailable' }
  | { kind: 'unsupported' }

/**
 * How long the device may look for a fix once the person has allowed it — past it the browser answers TIMEOUT, where
 * its own default waits for ever.
 * [MDN — Geolocation.getCurrentPosition(), options.timeout](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition#timeout)
 */
const FIX_TIMEOUT_MS = 10_000

/**
 * Only PERMISSION_DENIED is the person's refusal. POSITION_UNAVAILABLE and TIMEOUT come after they allowed it: the
 * device found no fix.
 * [MDN — GeolocationPositionError.code](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError/code)
 */
const refusal = (error: GeolocationPositionError): LocateOutcome =>
  error.code === error.PERMISSION_DENIED ? { kind: 'denied' } : { kind: 'unavailable' }

function currentPosition(geolocation: Geolocation): Promise<LocateOutcome> {
  return new Promise((resolve) => {
    geolocation.getCurrentPosition(
      ({ coords }) => resolve({ kind: 'located', latitude: coords.latitude, longitude: coords.longitude }),
      (error) => resolve(refusal(error)),
      { timeout: FIX_TIMEOUT_MS },
    )
  })
}

export function useGeolocation() {
  const locate = (): Promise<LocateOutcome> =>
    navigator.geolocation ? currentPosition(navigator.geolocation) : Promise.resolve({ kind: 'unsupported' })

  return { locate }
}
