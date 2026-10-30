import { TRACKER_SETTINGS_PATH, trackerSettingsIn, type TrackerSettings } from '../errorTracking/trackerSettings'

/**
 * The tracker the deployment names for the browser, asked of the edge — none where it names none, or where no edge
 * answers, as on the dev server, which serves the page in its place.
 */
export async function servedTrackerSettings(): Promise<TrackerSettings | undefined> {
  const response = await fetch(new URL(TRACKER_SETTINGS_PATH, window.location.origin))
  if (!response.ok || !response.headers.get('content-type')?.includes('json')) return undefined
  return trackerSettingsIn(await response.json())
}
