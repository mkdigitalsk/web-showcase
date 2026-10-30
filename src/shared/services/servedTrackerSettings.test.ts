import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { TRACKER_SETTINGS_PATH } from '../errorTracking/trackerSettings'
import { PRODUCTION_TRACKER, trackerNamed } from '../../test/errorTracker'
import { server } from '../../test/server'
import { servedTrackerSettings } from './servedTrackerSettings'

describe('the tracker the deployment names for the browser', () => {
  it('is the one the edge answers with', async () => {
    trackerNamed()

    expect(await servedTrackerSettings()).toEqual(PRODUCTION_TRACKER)
  })

  it('is none where the edge names none', async () => {
    expect(await servedTrackerSettings()).toBeUndefined()
  })

  it('is none where no edge answers, as on the dev server, which serves the page instead', async () => {
    server.use(http.get(TRACKER_SETTINGS_PATH, () => HttpResponse.html('<!doctype html><title>Web Showcase</title>')))

    expect(await servedTrackerSettings()).toBeUndefined()
  })
})
