import type { ErrorEvent, Exception, StackFrame } from '@sentry/browser'

type Context = NonNullable<ErrorEvent['contexts']>[string]

type Mechanism = NonNullable<Exception['mechanism']>

/** The contexts that describe the server rather than the request — the runtime and the system it runs on. */
const SERVER_CONTEXTS: ReadonlySet<string> = new Set(['os', 'runtime'])

/** The tags that say how the server path answered, never what the request carried. */
const FAILURE_TAGS: ReadonlySet<string> = new Set(['status'])

/**
 * What of a failure on the server path leaves for the tracker — the exceptions' types and stacks, the status the path
 * answered with and the runtime it ran on. What an exception said stays in the host log: a message quotes the body,
 * the address or the token that broke it.
 */
export function serverEvent(event: ErrorEvent): ErrorEvent {
  const { event_id, timestamp, platform, level, environment, release, sdk, debug_meta } = event
  return {
    type: undefined,
    event_id,
    timestamp,
    platform,
    level,
    environment,
    release,
    sdk,
    debug_meta,
    exception: { values: event.exception?.values?.map(thrown) },
    tags: failureTags(event.tags),
    contexts: serverContexts(event.contexts),
  }
}

/**
 * What of an error thrown on a page leaves for the tracker — the exceptions' types and stacks, the page's address
 * without its query or fragment, and the browser's user agent, which names the browser the visitor reports. What an
 * exception said stays on the page, as on the server.
 */
export function pageEvent(event: ErrorEvent): ErrorEvent {
  const { event_id, timestamp, platform, level, environment, release, sdk, debug_meta } = event
  const page = event.request?.url
  const userAgent = event.request?.headers?.['User-Agent']
  return {
    type: undefined,
    event_id,
    timestamp,
    platform,
    level,
    environment,
    release,
    sdk,
    debug_meta,
    exception: { values: event.exception?.values?.map(thrown).map(thrownOnPage) },
    request: {
      url: page === undefined ? undefined : pageAddress(page),
      headers: userAgent === undefined ? undefined : { 'User-Agent': userAgent },
    },
  }
}

/**
 * A page's address by its protocol, host and path alone — its query and fragment cut. Joined by hand, since the SDK
 * writes the page of a frame with no file as `app:///…`, whose origin is opaque.
 */
function pageAddress(address: string): string | undefined {
  const page = URL.parse(address)
  return page === null ? undefined : `${page.protocol}//${page.host}${page.pathname}`
}

/**
 * An exception whose frames name a page as {@link pageAddress} names it — a thrown value with no stack, or code
 * inline in the page, has the page's full address for its file.
 */
const thrownOnPage = (exception: Exception): Exception => ({
  ...exception,
  stacktrace: exception.stacktrace && { frames: exception.stacktrace.frames?.map(frameOnPage) },
})

const frameOnPage = (frame: StackFrame): StackFrame => ({
  ...frame,
  filename: frame.filename && pageAddress(frame.filename),
  abs_path: frame.abs_path && pageAddress(frame.abs_path),
})

/** An exception's type and where it was thrown, never what it said. */
const thrown = ({ type, mechanism, stacktrace }: Exception): Exception => ({
  type,
  mechanism: mechanism && chainOf(mechanism),
  stacktrace: stacktrace && { frames: stacktrace.frames?.map(placeOf) },
})

/** How the exception was caught and where it sits in a chain of causes, never the data a handler attached to it. */
const chainOf = ({ type, handled, synthetic, source, is_exception_group, exception_id, parent_id }: Mechanism) => ({
  type,
  handled,
  synthetic,
  source,
  is_exception_group,
  exception_id,
  parent_id,
})

/** Where a frame sits in the code, never its variables or the source lines around it. */
const placeOf = ({ filename, abs_path, module, function: name, lineno, colno, in_app }: StackFrame): StackFrame => ({
  filename,
  abs_path,
  module,
  function: name,
  lineno,
  colno,
  in_app,
})

function failureTags(tags: ErrorEvent['tags']): ErrorEvent['tags'] {
  const kept = Object.entries(tags ?? {}).filter(([name]) => FAILURE_TAGS.has(name))
  return kept.length === 0 ? undefined : Object.fromEntries(kept)
}

function serverContexts(contexts: ErrorEvent['contexts']): Record<string, Context> {
  return Object.fromEntries(Object.entries(contexts ?? {}).filter(([name]) => SERVER_CONTEXTS.has(name)))
}
