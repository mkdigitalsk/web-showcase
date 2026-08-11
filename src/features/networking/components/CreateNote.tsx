import { useState } from 'react'
import { Box, Stack } from '@mui/material'
import { AlertError, Button, ElevatedCard, Input } from '../../../shared/components'
import { useTranslation } from '../../../shared/hooks'
import { requestErrorKey } from '../../../shared/api'
import { useCreateNote } from '../useNotes'

export function CreateNote() {
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const create = useCreateNote()

  const submit = () => {
    create.mutate(
      { title, content },
      {
        onSuccess: () => {
          setTitle('')
          setContent('')
        },
      },
    )
  }

  return (
    <ElevatedCard sx={{ p: 2, mb: 3 }}>
      <Stack spacing={2}>
        <Input label={t('notes.titleLabel')} value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
        <Input
          label={t('notes.contentLabel')}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          multiline
          minRows={2}
        />
        {create.isError && <AlertError>{t(requestErrorKey(create.error, 'notes.saveFailed'))}</AlertError>}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={submit} disabled={!title.trim() || create.isPending} loading={create.isPending}>
            {t('notes.add')}
          </Button>
        </Box>
      </Stack>
    </ElevatedCard>
  )
}
