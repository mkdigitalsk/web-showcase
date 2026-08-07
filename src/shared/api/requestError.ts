import { isAxiosError } from 'axios'

const SERVER_ERROR = 500

export function httpStatus(error: unknown): number | undefined {
  return isAxiosError(error) ? error.response?.status : undefined
}

// No response at all means the request never completed — CORS, DNS and offline all land here.
export function requestErrorKey(error: unknown, fallbackKey: string): string {
  if (isAxiosError(error) && !error.response) return 'errors.unreachable'

  const status = httpStatus(error)
  return status !== undefined && status >= SERVER_ERROR ? 'errors.server' : fallbackKey
}
