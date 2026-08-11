import { Add, Remove } from '@mui/icons-material'
import { Box, IconButton, Stack } from '@mui/material'
import {
  Button,
  ElevatedCard,
  PageContainer,
  PageHeader,
  TextBody1Neutral80,
  TextH6Bold,
} from '../../shared/components'
import { useLocalStorage, useSessionStorage, useTranslation } from '../../shared/hooks'
import { StorageKey } from '../../shared/enums/storageKey'

export function StoragePage() {
  const { t } = useTranslation()
  const [sessionCounter, setSessionCounter, clearSession] = useSessionStorage(StorageKey.SESSION_COUNTER, 0)
  const [persistentCounter, setPersistentCounter] = usePersistentCounter()

  return (
    <PageContainer>
      <PageHeader title={t('storage.title')} description={t('storage.subtitle')} />

      <Stack spacing={2}>
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
      </Stack>
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
  return (
    <ElevatedCard sx={{ p: 2 }}>
      <TextH6Bold sx={{ mb: 0.5 }}>{label}</TextH6Bold>
      <TextBody1Neutral80 sx={{ mb: 2 }}>{hint}</TextBody1Neutral80>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={onDecrement} color="primary">
          <Remove />
        </IconButton>
        <Box sx={{ minWidth: 32, textAlign: 'center' }}>
          <TextH6Bold>{counter}</TextH6Bold>
        </Box>
        <IconButton onClick={onIncrement} color="primary">
          <Add />
        </IconButton>
      </Box>
    </ElevatedCard>
  )
}
