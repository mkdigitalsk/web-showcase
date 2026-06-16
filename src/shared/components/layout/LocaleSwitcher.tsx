import { Check } from '@mui/icons-material'
import { Box, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import { useAuth, useLocale, useTranslation } from '../../hooks'

export function LocaleSwitcher() {
  const { t } = useTranslation()
  const { locale, locales } = useLocale()
  const { updateLocale } = useAuth()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const current = locales.find((l) => l.code === locale)

  const handleSelect = (code: string) => {
    void updateLocale(code)
    setAnchor(null)
  }

  return (
    <>
      <IconButton onClick={(e) => setAnchor(e.currentTarget)} size="small" aria-label={t('localeSwitcher.label')}>
        <Box component="span" sx={{ fontSize: 20, lineHeight: 1 }}>{current?.flag}</Box>
      </IconButton>

      <Menu
        anchorEl={anchor}
        open={!!anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {locales.map((option) => (
          <MenuItem key={option.code} selected={option.code === locale} onClick={() => handleSelect(option.code)}>
            <Box component="span" sx={{ mr: 1.5, fontSize: 18 }}>{option.flag}</Box>
            {option.label}
            {option.code === locale && (
              <ListItemIcon sx={{ ml: 'auto', minWidth: 'auto' }}>
                <Check fontSize="small" />
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
