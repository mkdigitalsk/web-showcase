// Single source of truth for the API version segment — mirrors the server's contracts.ApiVersion.
// Bump CURRENT to migrate every route at once; once a URL is public it is a contract (add v2 alongside, never change v1).
export const ApiVersion = {
  V1: 'v1',
  CURRENT: 'v1',
} as const

export const API_PREFIX = `/api/${ApiVersion.CURRENT}` // -> /api/v1
