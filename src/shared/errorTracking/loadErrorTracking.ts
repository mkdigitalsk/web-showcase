/**
 * The browser SDK, loaded and started under the tracker the build inlined — nothing where the build had none. It
 * starts the client before it resolves, so a boundary's report that loads it first still finds one.
 */
export async function loadErrorTracking() {
  const built = __ERROR_TRACKER__
  if (built === null) return undefined
  const tracking = await import('./browserErrorTracking')
  tracking.startBrowserErrorTracking(built)
  return tracking
}
