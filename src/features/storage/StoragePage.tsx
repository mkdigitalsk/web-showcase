import { DecreaseIcon, IncreaseIcon } from '../../shared/components/icons/catalog'
import {
  Button,
  Card,
  IconButton,
  PageContainer,
  PageHeader,
  TextBody1Neutral80,
  TextH6Bold,
} from '../../shared/components'
import { useLocalStorage, useSessionStorage, useTranslation } from '../../shared/hooks'
import { StorageKey } from '../../shared/enums/storageKey'
import styles from './StoragePage.module.css'

export default function StoragePage() {
  const { t } = useTranslation()
  const [sessionCounter, setSessionCounter, clearSession] = useSessionStorage(StorageKey.SESSION_COUNTER, 0)
  const [persistentCounter, setPersistentCounter] = usePersistentCounter()

  return (
    <PageContainer>
      <PageHeader title={t('storage.title')} description={t('storage.subtitle')} />

      <div className={styles.cards}>
        <CounterCard
          label={t('storage.session.label')}
          hint={t('storage.session.hint')}
          counter={sessionCounter}
          onIncrement={() => setSessionCounter((n) => n + 1)}
          onDecrement={() => setSessionCounter((n) => n - 1)}
        />

        <CounterCard
          label={t('storage.persistent.label')}
          hint={t('storage.persistent.hint')}
          counter={persistentCounter}
          onIncrement={() => setPersistentCounter((n) => n + 1)}
          onDecrement={() => setPersistentCounter((n) => n - 1)}
        />

        <Button variant="outline" onClick={() => clearSession()}>
          {t('storage.clearSession')}
        </Button>
      </div>
    </PageContainer>
  )
}

function usePersistentCounter() {
  return useLocalStorage(StorageKey.PERSISTENT_COUNTER, 0)
}

interface CounterCardProps {
  label: string
  hint: string
  counter: number
  onIncrement: () => void
  onDecrement: () => void
}

function CounterCard({ label, hint, counter, onIncrement, onDecrement }: CounterCardProps) {
  const { t } = useTranslation()

  return (
    <Card className={styles.card}>
      <TextH6Bold>{label}</TextH6Bold>
      <TextBody1Neutral80 className={styles.hint}>{hint}</TextBody1Neutral80>
      <div className={styles.counter}>
        <IconButton onClick={onDecrement} tone="action" aria-label={t('storage.decrement')}>
          <DecreaseIcon aria-hidden />
        </IconButton>
        <TextH6Bold className={styles.value}>{counter}</TextH6Bold>
        <IconButton onClick={onIncrement} tone="action" aria-label={t('storage.increment')}>
          <IncreaseIcon aria-hidden />
        </IconButton>
      </div>
    </Card>
  )
}
