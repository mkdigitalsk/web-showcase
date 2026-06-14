import { useIntl } from 'react-intl'

export function useTranslation() {
  const intl = useIntl()

  return {
    t: (id: string) => intl.formatMessage({ id }),
    intl,
  }
}
