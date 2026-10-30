import { servedTrackerSettings } from '../services/servedTrackerSettings'

/**
 * The browser SDK, loaded and started under the tracker the deployment names — nothing where it names none. It
 * starts the client before it resolves, so a boundary's report that loads it first still finds one.
 */
export async function loadErrorTracking() {
  const settings = await servedTrackerSettings()
  if (settings === undefined) return undefined
  const tracking = await import('./browserErrorTracking')
  tracking.startBrowserErrorTracking(settings)
  return tracking
}
