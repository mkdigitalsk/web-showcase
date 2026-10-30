/** A Sentry project's DSN — its address, with the project's public key as the user and its id as the path. */
export type Dsn = string & { readonly __brand: 'Dsn' }

/** Where a deployment files its failures — the project its DSN names, under the deployment's environment. */
export interface TrackerSettings {
  readonly dsn: Dsn
  /** Vercel's name for the deployment's environment — `production` or `preview` — and `development` off Vercel. */
  readonly environment: string
}

/** The variables the settings are read from — the build's environment, or the edge's as a request arrives. */
type Environment = Readonly<Record<string, string | undefined>>

/**
 * [value] as a DSN, once it has a scheme of the web, a key and a project.
 *
 * @see {@link https://docs.sentry.io/concepts/key-terms/dsn-explainer/#the-parts-of-the-data-source-name-dsn | Sentry — Data Source Name (DSN), The Parts of the Data Source Name (DSN)}
 */
function dsnOf(value: string): Dsn {
  const address = URL.parse(value)
  const named =
    address !== null &&
    (address.protocol === 'https:' || address.protocol === 'http:') &&
    address.username !== '' &&
    address.pathname.replaceAll('/', '') !== ''
  if (!named) throw new Error('SENTRY_DSN is malformed — .env.example describes it')
  return value as Dsn
}

/** The settings [environment] names — none while SENTRY_DSN is blank, so nothing is recorded. */
export function trackerSettingsOf(environment: Environment): TrackerSettings | undefined {
  const dsn = environment.SENTRY_DSN?.trim()
  if (!dsn) return undefined
  return { dsn: dsnOf(dsn), environment: environment.VERCEL_ENV || 'development' }
}
