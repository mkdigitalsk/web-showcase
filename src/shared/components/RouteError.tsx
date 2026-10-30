import { useLocation, useNavigate, useNavigation, useRouteError } from 'react-router'
import { useTranslation } from '../hooks'
import { useErrorReport } from '../hooks/useErrorReport'
import { Button } from './Button'
import { TextBody1Neutral60, TextH4Bold } from './text'
import styles from './RouteError.module.css'

/**
 * What a route renders once it has crashed. The error itself is never shown — its message is the thrown value's own
 * text, which carries whatever detail the failure happened to hold — and goes to the error tracker alone.
 *
 * Retry navigates to the address already open: the router clears a route's error on a new location, and runs its
 * loaders again on the way. A revalidation alone clears nothing on a route that has no loader.
 */
export function RouteError() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname, search, hash } = useLocation()
  const isRetrying = useNavigation().state !== 'idle'
  useErrorReport(useRouteError())

  return (
    <div className={styles.error}>
      <TextH4Bold>{t('errors.routeTitle')}</TextH4Bold>
      <TextBody1Neutral60>{t('errors.routeBody')}</TextBody1Neutral60>
      <Button onClick={() => void navigate({ pathname, search, hash }, { replace: true })} loading={isRetrying}>
        {t('common.retry')}
      </Button>
    </div>
  )
}
