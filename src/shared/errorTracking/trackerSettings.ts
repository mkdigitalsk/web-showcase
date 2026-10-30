/** A Sentry project's DSN — its address, with the project's public key as the user and its id as the path. */
export type Dsn = string & { readonly __brand: 'Dsn' }

/** The environments a failure is filed under — Vercel's names for a deployment's, and `development` off Vercel. */
export const ENVIRONMENTS = ['production', 'preview', 'development'] as const

export type Environment = (typeof ENVIRONMENTS)[number]

/** Where a deployment files its failures — the project its DSN names, under the deployment's environment. */
export interface TrackerSettings {
  readonly dsn: Dsn
  readonly environment: Environment
}

/** The variables the settings are read from — the build's environment, or the edge's as a request arrives. */
type Variables = Readonly<Record<string, string | undefined>>

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

/** [value] as one of the {@link ENVIRONMENTS} — `development` where no platform names one. */
function environmentOf(value: string | undefined): Environment {
  if (!value) return 'development'
  const named = ENVIRONMENTS.find((environment) => environment === value)
  if (named === undefined) throw new Error(`VERCEL_ENV is malformed — it names none of ${ENVIRONMENTS.join(', ')}`)
  return named
}

/** The settings [variables] name — none while SENTRY_DSN is blank, so nothing is recorded. */
export function trackerSettingsOf(variables: Variables): TrackerSettings | undefined {
  const dsn = variables.SENTRY_DSN?.trim()
  if (!dsn) return undefined
  return { dsn: dsnOf(dsn), environment: environmentOf(variables.VERCEL_ENV) }
}
