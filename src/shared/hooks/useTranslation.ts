import { useIntl } from 'react-intl'

export function useTranslation() {
  const intl = useIntl()

  return {
    t: (id: string, values?: Record<string, string | number>) => intl.formatMessage({ id }, values),
    intl,
  }
}
