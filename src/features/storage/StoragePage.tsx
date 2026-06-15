import { Add, Remove } from '@mui/icons-material'
import { Box, IconButton, Stack } from '@mui/material'
import { Button, ElevatedCard, TextBody1Neutral60, TextBody1Neutral80, TextH6Bold, TextH4BoldPrimary } from '../../shared/components'
import { useLocalStorage, useSessionStorage, useTranslation } from '../../shared/hooks'
import { StorageKey } from '../../shared/enums/storageKey'

export function StoragePage() {
  const { t } = useTranslation()
  const [sessionCounter, setSessionCounter, clearSession] = useSessionStorage(StorageKey.SESSION_COUNTER, 0)
  const [persistentCounter, setPersistentCounter] = usePersistentCounter()

  return (
    <Box sx={{ p: 2 }}>
      <TextH4BoldPrimary sx={{ mb: 0.5 }}>{t('storage.title')}</TextH4BoldPrimary>
      <TextBody1Neutral60 sx={{ mb: 3 }}>{t('storage.subtitle')}</TextBody1Neutral60>

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
    </Box>
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
        <TextH6Bold sx={{ minWidth: 32, textAlign: 'center' }}>{counter}</TextH6Bold>
        <IconButton onClick={onIncrement} color="primary">
          <Add />
        </IconButton>
      </Box>
    </ElevatedCard>
  )
}
