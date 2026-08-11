import { useState } from 'react'
import { Delete, Edit } from '@mui/icons-material'
import { Box, IconButton, Stack } from '@mui/material'
import {
  AlertError,
  Button,
  ElevatedCard,
  Input,
  TextBody1Neutral60,
  TextBody1Neutral80,
} from '../../../shared/components'
import { useTranslation } from '../../../shared/hooks'
import { requestErrorKey } from '../../../shared/api'
import type { RemoteNote } from '../../../shared/types'
import { conflictingNote, useDeleteNote, useUpdateNote } from '../useNotes'
import { NoteConflictDialog } from './NoteConflictDialog'

export function NoteRow({ note }: { note: RemoteNote }) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState<{ title: string; content: string; etag: string } | null>(null)
  const update = useUpdateNote()
  const remove = useDeleteNote()

  // The tag is captured here, when editing starts, and not re-read on save. Re-reading it would
  // adopt whatever landed meanwhile and the write would overwrite an edit this person never saw.
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
      <ElevatedCard sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <TextBody1Neutral80>{note.title}</TextBody1Neutral80>
            <TextBody1Neutral60>{note.content}</TextBody1Neutral60>
          </Box>
          <IconButton onClick={startEditing} aria-label={t('notes.edit')}>
            <Edit fontSize="small" aria-hidden />
          </IconButton>
          <IconButton onClick={() => remove.mutate(note.id)} disabled={remove.isPending} aria-label={t('notes.delete')}>
            <Delete fontSize="small" aria-hidden />
          </IconButton>
        </Box>
      </ElevatedCard>
    )
  }

  return (
    <ElevatedCard sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Input
          label={t('notes.titleLabel')}
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          fullWidth
        />
        <Input
          label={t('notes.contentLabel')}
          value={draft.content}
          onChange={(e) => setDraft({ ...draft, content: e.target.value })}
          fullWidth
          multiline
          minRows={2}
        />
        {update.isError && !conflict && <AlertError>{t(requestErrorKey(update.error, 'notes.saveFailed'))}</AlertError>}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="outline" onClick={() => setDraft(null)}>
            {t('notes.cancel')}
          </Button>
          <Button onClick={() => save(draft.etag)} disabled={update.isPending} loading={update.isPending}>
            {t('notes.save')}
          </Button>
        </Box>
      </Stack>

      {conflict && (
        <NoteConflictDialog
          theirs={conflict}
          yours={{ title: draft.title, content: draft.content }}
          // Reload drops our edit for theirs. Overwrite keeps ours and retries against the tag the
          // server just handed back, which is the only one that can succeed now.
          onReload={() => {
            update.reset()
            setDraft(null)
          }}
          onOverwrite={() => save(conflict.etag)}
        />
      )}
    </ElevatedCard>
  )
}
