import { RefreshIcon } from '../../shared/components/icons/catalog'
import {
  AlertError,
  IconButton,
  LoadingView,
  PageContainer,
  PageHeader,
  TextBody1Neutral60,
} from '../../shared/components'
import { useTranslation } from '../../shared/hooks'
import { queryClient, requestErrorKey } from '../../shared/api'
import { CreateNote } from './components/CreateNote'
import { NoteRow } from './components/NoteRow'
import { notesQueryOptions, useNotesQuery } from './useNotes'
import styles from './NetworkingPage.module.css'

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
      <div className={styles.header}>
        <PageHeader title={t('networking.title')} description={t('networking.subtitle')} />
        <IconButton onClick={() => void refetch()} disabled={isFetching} aria-label={t('networking.refresh')}>
          <RefreshIcon aria-hidden />
        </IconButton>
      </div>

      <CreateNote />

      {showLoading && <LoadingView />}
      {showError && <AlertError>{t(requestErrorKey(error, 'common.error'))}</AlertError>}
      {!showLoading && !showError && !hasNotes && (
        <div className={styles.empty}>
          <TextBody1Neutral60>{t('networking.empty')}</TextBody1Neutral60>
        </div>
      )}
      {hasNotes && (
        <div className={styles.notes}>
          {notes.map((note) => (
            <NoteRow key={note.id} note={note} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
