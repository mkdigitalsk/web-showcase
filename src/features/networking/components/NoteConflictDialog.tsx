import {
  Button,
  Dialog,
  TextBody1Neutral60,
  TextBody1Neutral80,
  TextCaptionNeutral60,
} from '../../../shared/components'
import { useTranslation } from '../../../shared/hooks'
import type { RemoteNote, RemoteNoteInput } from '../../../shared/types'

interface NoteConflictDialogProps {
  theirs: RemoteNote
  yours: RemoteNoteInput
  onReload: () => void
  onOverwrite: () => void
}

export function NoteConflictDialog({ theirs, yours, onReload, onOverwrite }: NoteConflictDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog
      open
      title={t('notes.conflictTitle')}
      onClose={onReload}
      actions={
        <>
          <Button variant="outline" onClick={onReload}>
            {t('notes.conflictReload')}
          </Button>
          <Button onClick={onOverwrite}>{t('notes.conflictOverwrite')}</Button>
        </>
      }
    >
      <TextBody1Neutral60>{t('notes.conflictBody')}</TextBody1Neutral60>
      <div>
        <TextCaptionNeutral60>{t('notes.conflictTheirs')}</TextCaptionNeutral60>
        <TextBody1Neutral80>{theirs.title}</TextBody1Neutral80>
        <TextBody1Neutral60>{theirs.content}</TextBody1Neutral60>
      </div>
      <div>
        <TextCaptionNeutral60>{t('notes.conflictYours')}</TextCaptionNeutral60>
        <TextBody1Neutral80>{yours.title}</TextBody1Neutral80>
        <TextBody1Neutral60>{yours.content}</TextBody1Neutral60>
      </div>
    </Dialog>
  )
}
