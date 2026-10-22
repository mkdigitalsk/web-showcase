import { useState } from 'react'
import { DeleteIcon, SortIcon } from '../../shared/components/icons/catalog'
import {
  AlertError,
  Button,
  Card,
  IconButton,
  Input,
  LoadingView,
  Menu,
  MenuItem,
  PageContainer,
  PageHeader,
  TextArea,
  TextBody1Neutral60,
  TextBody1Neutral80,
  TextH6Bold,
  TextTimestamp,
} from '../../shared/components'
import { useTranslation } from '../../shared/hooks'
import { useNotesDb, type SortOption } from './hooks/useNotesDb'
import { type Note } from './types'
import styles from './DatabasePage.module.css'

export default function DatabasePage() {
  const { t } = useTranslation()
  const {
    notes,
    isLoading,
    isEmpty,
    hasNotes,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    addNote,
    deleteNote,
    deleteAllNotes,
  } = useNotesDb()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async () => {
    if (!title.trim()) return
    try {
      await addNote(title.trim(), content.trim())
      setTitle('')
      setContent('')
    } catch {
      setError(t('database.error'))
    }
  }

  const sortOptions: { value: SortOption; labelKey: string }[] = [
    { value: 'DATE_DESC', labelKey: 'database.sort.dateNewest' },
    { value: 'DATE_ASC', labelKey: 'database.sort.dateOldest' },
    { value: 'TITLE_ASC', labelKey: 'database.sort.titleAsc' },
    { value: 'TITLE_DESC', labelKey: 'database.sort.titleDesc' },
  ]

  return (
    <PageContainer>
      <PageHeader title={t('database.title')} description={t('database.subtitle')} />
      <div className={styles.sections}>
        <div className={styles.search}>
          <Input
            placeholder={t('database.search.hint')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
          />
          <Menu
            trigger={
              <IconButton aria-label={t('database.sort.by')}>
                <SortIcon aria-hidden />
              </IconButton>
            }
          >
            {sortOptions.map((opt) => (
              <MenuItem key={opt.value} selected={sortOption === opt.value} onClick={() => setSortOption(opt.value)}>
                {t(opt.labelKey)}
              </MenuItem>
            ))}
          </Menu>
        </div>

        <Card className={styles.card}>
          <div className={styles.form}>
            <Input
              label={t('database.noteTitle.label')}
              placeholder={t('database.noteTitle.hint')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextArea
              label={t('database.noteContent.label')}
              placeholder={t('database.noteContent.hint')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              minRows={3}
            />
            <Button onClick={() => void handleAdd()} disabled={!title.trim()}>
              {t('database.addNote')}
            </Button>
          </div>
        </Card>

        {error && <AlertError>{error}</AlertError>}
        {isLoading && <LoadingView />}
        {isEmpty && (
          <div className={styles.empty}>
            <TextBody1Neutral60>{t('database.empty')}</TextBody1Neutral60>
          </div>
        )}

        {notes.map((note: Note) => (
          <Card key={note.id} className={styles.card}>
            <div className={styles.note}>
              <div className={styles.noteBody}>
                <TextH6Bold>{note.title}</TextH6Bold>
                {note.content && <TextBody1Neutral80>{note.content}</TextBody1Neutral80>}
                <TextTimestamp value={note.createdAt} />
              </div>
              <IconButton size="small" onClick={() => void deleteNote(note.id!)} aria-label={t('database.deleteNote')}>
                <DeleteIcon aria-hidden />
              </IconButton>
            </div>
          </Card>
        ))}

        {hasNotes && (
          <Button variant="outline" onClick={() => void deleteAllNotes()}>
            {t('database.clearAll')}
          </Button>
        )}
      </div>
    </PageContainer>
  )
}
