import { Refresh } from '@mui/icons-material'
import { Box, IconButton, Stack } from '@mui/material'
import { AlertError, LoadingView, PageContainer, PageHeader, TextBody1Neutral60 } from '../../shared/components'
import { useTranslation } from '../../shared/hooks'
import { queryClient, requestErrorKey } from '../../shared/api'
import { CreateNote } from './components/CreateNote'
import { NoteRow } from './components/NoteRow'
import { notesQueryOptions, useNotesQuery } from './useNotes'

/**
 * The notes arrive with the navigation. A failed load does not throw: the page shows it beside its own Retry,
 * where the action happened, rather than handing the route to its error boundary.
 */
export async function clientLoader() {
  await queryClient.prefetchQuery(notesQueryOptions)
  return null
}

export default function NetworkingPage() {
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
