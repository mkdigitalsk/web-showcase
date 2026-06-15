import { Delete, FilterList } from '@mui/icons-material'
import { Box, IconButton, Menu, MenuItem, Stack, TextField } from '@mui/material'
import { useState } from 'react'
import {
  AlertError,
  Button,
  ElevatedCard,
  Input,
  LoadingView,
  TextBody1Neutral60,
  TextBody1Neutral80,
  TextH6Bold,
} from '../../shared/components'
import { useNotesDb, useTranslation, type SortOption } from '../../shared/hooks'

export function DatabasePage() {
  const { t } = useTranslation()
  const {
    notes,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    isLoading,
    error,
    addNote,
    deleteNote,
    deleteAllNotes,
  } = useNotesDb()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null)

  const handleAdd = async () => {
    if (!title.trim()) return
    await addNote(title.trim(), content.trim())
    setTitle('')
    setContent('')
  }

  const sortOptions: { value: SortOption; labelKey: string }[] = [
    { value: 'DATE_DESC', labelKey: 'database.sort.dateNewest' },
    { value: 'DATE_ASC', labelKey: 'database.sort.dateOldest' },
    { value: 'TITLE_ASC', labelKey: 'database.sort.titleAsc' },
    { value: 'TITLE_DESC', labelKey: 'database.sort.titleDesc' },
  ]

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            fullWidth
            placeholder={t('database.search.hint')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IconButton onClick={(e) => setFilterAnchor(e.currentTarget)}>
            <FilterList />
          </IconButton>
          <Menu
            anchorEl={filterAnchor}
            open={Boolean(filterAnchor)}
            onClose={() => setFilterAnchor(null)}
          >
            <MenuItem disabled sx={{ fontWeight: 'bold', opacity: 1 }}>
              <TextBody1Neutral80>{t('database.sort.by')}</TextBody1Neutral80>
            </MenuItem>
            {sortOptions.map((opt) => (
              <MenuItem
                key={opt.value}
                selected={sortOption === opt.value}
                onClick={() => { setSortOption(opt.value); setFilterAnchor(null) }}
              >
                {t(opt.labelKey)}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <ElevatedCard sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Input
              label={t('database.title.label')}
              placeholder={t('database.title.hint')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
            <Input
              label={t('database.content.label')}
              placeholder={t('database.content.hint')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
            <Button onClick={() => void handleAdd()} disabled={!title.trim()}>
              {t('database.addNote')}
            </Button>
          </Stack>
        </ElevatedCard>

        {isLoading && <LoadingView />}
        {error && <AlertError>{t('database.error')}</AlertError>}
        {!isLoading && !error && notes.length === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <TextBody1Neutral60>{t('database.empty')}</TextBody1Neutral60>
          </Box>
        )}

        {notes.map((note) => (
          <ElevatedCard key={note.id} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <TextH6Bold>{note.title}</TextH6Bold>
                {note.content && (
                  <TextBody1Neutral80 sx={{ mt: 0.5 }}>{note.content}</TextBody1Neutral80>
                )}
                <TextBody1Neutral60 sx={{ mt: 1, fontSize: '0.75rem' }}>
                  {formatTimestamp(note.createdAt)}
                </TextBody1Neutral60>
              </Box>
              <IconButton onClick={() => void deleteNote(note.id!)} size="small">
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </ElevatedCard>
        ))}

        {notes.length > 0 && (
          <Button variant="outline" onClick={() => void deleteAllNotes()}>
            {t('database.clearAll')}
          </Button>
        )}
      </Stack>
    </Box>
  )
}

function formatTimestamp(ms: number): string {
  const d = new Date(ms)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
