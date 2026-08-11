import { Refresh } from '@mui/icons-material'
import { Box, IconButton, Stack } from '@mui/material'
import { AlertError, LoadingView, PageContainer, PageHeader, TextBody1Neutral60 } from '../../shared/components'
import { useTranslation } from '../../shared/hooks'
import { requestErrorKey } from '../../shared/api'
import { CreateNote } from './components/CreateNote'
import { NoteRow } from './components/NoteRow'
import { useNotesQuery } from './useNotes'

// The remote counterpart to the Database screen: the same note, kept on the server rather than on the
// device. Only the signed-in account's own notes are reachable — the server scopes the query.
export function NetworkingPage() {
  const { t } = useTranslation()
  const { data: notes, isLoading, isError, error, refetch, isFetching } = useNotesQuery()

  const hasNotes = notes && notes.length > 0
  const showLoading = isLoading && !notes
  const showError = isError && !notes

  return (
    <PageContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
        <PageHeader title={t('networking.title')} description={t('networking.subtitle')} />
        <IconButton onClick={() => void refetch()} disabled={isFetching} aria-label={t('networking.refresh')}>
          <Refresh aria-hidden />
        </IconButton>
      </Box>

      <CreateNote />

      {showLoading && <LoadingView />}
      {showError && <AlertError sx={{ mt: 2 }}>{t(requestErrorKey(error, 'common.error'))}</AlertError>}
      {!showLoading && !showError && !hasNotes && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <TextBody1Neutral60>{t('networking.empty')}</TextBody1Neutral60>
        </Box>
      )}
      {hasNotes && (
        <Stack spacing={2}>
          {notes.map((note) => (
            <NoteRow key={note.id} note={note} />
          ))}
        </Stack>
      )}
    </PageContainer>
  )
}
