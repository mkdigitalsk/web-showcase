import { useState } from 'react'
import { DeleteIcon, EditIcon } from '../../../shared/components/icons/catalog'
import {
  AlertError,
  Button,
  Card,
  IconButton,
  Input,
  TextArea,
  TextBody1Neutral60,
  TextBody1Neutral80,
} from '../../../shared/components'
import { useTranslation } from '../../../shared/hooks'
import { requestErrorKey } from '../../../shared/api'
import type { RemoteNote } from '../../../shared/types'
import { conflictingNote, useDeleteNote, useUpdateNote } from '../useNotes'
import { NoteConflictDialog } from './NoteConflictDialog'
import styles from './NoteRow.module.css'

interface Draft {
  title: string
  content: string
  /** Captured when editing starts; re-reading it on save would overwrite an unseen edit. */
  etag: string
}

export function NoteRow({ note }: { note: RemoteNote }) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState<Draft | null>(null)
  const update = useUpdateNote()
  const remove = useDeleteNote()

  const startEditing = () => setDraft({ title: note.title, content: note.content, etag: note.etag })

  const save = (etag: string) => {
    if (!draft) return
    update.mutate(
      { id: note.id, input: { title: draft.title, content: draft.content }, etag },
      { onSuccess: () => setDraft(null) },
    )
  }

  const conflict = conflictingNote(update.error)

  if (!draft) {
    return (
      <Card className={styles.card}>
        <div className={styles.row}>
          <div className={styles.body}>
            <TextBody1Neutral80>{note.title}</TextBody1Neutral80>
            <TextBody1Neutral60>{note.content}</TextBody1Neutral60>
          </div>
          <IconButton onClick={startEditing} aria-label={t('notes.edit')}>
            <EditIcon aria-hidden />
          </IconButton>
          <IconButton onClick={() => remove.mutate(note.id)} disabled={remove.isPending} aria-label={t('notes.delete')}>
            <DeleteIcon aria-hidden />
          </IconButton>
        </div>
      </Card>
    )
  }

  return (
    <Card className={styles.card}>
      <div className={styles.form}>
        <Input
          label={t('notes.titleLabel')}
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
        <TextArea
          label={t('notes.contentLabel')}
          value={draft.content}
          onChange={(e) => setDraft({ ...draft, content: e.target.value })}
          minRows={2}
        />
        {update.isError && !conflict && <AlertError>{t(requestErrorKey(update.error, 'notes.saveFailed'))}</AlertError>}
        <div className={styles.actions}>
          <Button variant="outline" onClick={() => setDraft(null)}>
            {t('notes.cancel')}
          </Button>
          <Button onClick={() => save(draft.etag)} disabled={update.isPending} loading={update.isPending}>
            {t('notes.save')}
          </Button>
        </div>
      </div>

      {conflict && (
        <NoteConflictDialog
          theirs={conflict}
          yours={{ title: draft.title, content: draft.content }}
          onReload={() => {
            update.reset()
            setDraft(null)
          }}
          onOverwrite={() => save(conflict.etag)}
        />
      )}
    </Card>
  )
}
