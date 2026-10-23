import { useState } from 'react'
import { AlertError, Button, Card, Input, TextArea } from '../../../shared/components'
import { useTranslation } from '../../../shared/hooks'
import { requestErrorKey } from '../../../shared/api'
import { useCreateNote } from '../useNotes'
import styles from './CreateNote.module.css'

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
    <Card className={styles.card}>
      <Input label={t('notes.titleLabel')} value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextArea
        label={t('notes.contentLabel')}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        minRows={2}
      />
      {create.isError && <AlertError>{t(requestErrorKey(create.error, 'notes.saveFailed'))}</AlertError>}
      <div className={styles.actions}>
        <Button onClick={submit} disabled={!title.trim() || create.isPending} loading={create.isPending}>
          {t('notes.add')}
        </Button>
      </div>
    </Card>
  )
}
