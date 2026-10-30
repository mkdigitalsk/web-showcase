/// <reference types="vite/client" />

declare const __APP_VERSION__: string

/** The tracker the build inlined for the browser — none where its environment named no DSN. */
declare const __ERROR_TRACKER__: import('./shared/errorTracking/trackerSettings').TrackerSettings | null
