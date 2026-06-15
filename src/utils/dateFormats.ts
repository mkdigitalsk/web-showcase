export const DateFormats = {
  DATE: { year: 'numeric', month: '2-digit', day: '2-digit' },
  DATETIME: { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false },
  TIME: { hour: '2-digit', minute: '2-digit', hour12: false },
} satisfies Record<string, Intl.DateTimeFormatOptions>
