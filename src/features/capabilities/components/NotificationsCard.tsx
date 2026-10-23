import { useState } from 'react'
import { NotifyIcon } from '../../../shared/components/icons/catalog'
import { AlertError, AlertInfo, AlertSuccess, Button, Input } from '../../../shared/components'
import { useNotification, useTranslation, type NotifyOutcome } from '../../../shared/hooks'
import { useOutcome } from '../useOutcome'
import { CapabilityCard } from './CapabilityCard'
import { InfoRow } from './InfoRow'
import styles from './NotificationsCard.module.css'

const STATUS_KEY = {
  granted: 'capabilities.notifications.statusGranted',
  denied: 'capabilities.notifications.statusDenied',
  default: 'capabilities.notifications.statusDefault',
} satisfies Record<NotificationPermission, string>

export function NotificationsCard() {
  const { t } = useTranslation()
  const { isSupported, permission, notify } = useNotification()
  const [title, setTitle] = useState(t('capabilities.notifications.defaultTitle'))
  const [body, setBody] = useState(t('capabilities.notifications.defaultBody'))
  const { outcome, pending, run } = useOutcome<NotifyOutcome>()

  return (
    <CapabilityCard title={t('capabilities.notifications.title')} subtitle={t('capabilities.notifications.subtitle')}>
      {isSupported ? (
        <div className={styles.form}>
          <InfoRow label={t('capabilities.notifications.status')} value={t(STATUS_KEY[permission])} />
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="small"
            label={t('capabilities.notifications.titleLabel')}
          />
          <Input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            size="small"
            label={t('capabilities.notifications.bodyLabel')}
          />
          <div>
            <Button
              variant="outline"
              startIcon={<NotifyIcon />}
              loading={pending}
              onClick={() => void run(() => notify(title, body))}
            >
              {t('capabilities.notifications.send')}
            </Button>
          </div>
          {outcome === 'shown' && <AlertSuccess>{t('capabilities.notifications.sent')}</AlertSuccess>}
          {outcome === 'denied' && <AlertError>{t('capabilities.notifications.denied')}</AlertError>}
          {outcome === 'unsupported' && <AlertError>{t('capabilities.notifications.notSupported')}</AlertError>}
        </div>
      ) : (
        <AlertInfo>{t('capabilities.notifications.notSupported')}</AlertInfo>
      )}
    </CapabilityCard>
  )
}
