export function formatDate(ms: number, format: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(undefined, format).format(ms)
}
