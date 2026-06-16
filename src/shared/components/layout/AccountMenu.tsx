import { Check, ChevronRight, Logout, Palette, Settings } from '@mui/icons-material'
import { Avatar, Box, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useTranslation } from '../../hooks'
import type { ThemeMode } from '../../types'
import { Routes } from '../../../utils'
import { Divider } from '../dividers'
import { TextBody1Neutral60, TextBody1Neutral80 } from '../text'

const THEME_MODES: ThemeMode[] = ['system', 'light', 'dark']

export function AccountMenu() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, logout, updateThemeMode } = useAuth()
  const { mode = 'system' } = useColorScheme()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [themeAnchor, setThemeAnchor] = useState<HTMLElement | null>(null)

  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleLogout = async () => {
    setAnchor(null)
    await logout()
    navigate(Routes.LOGIN)
  }

  const handleSelectMode = (next: ThemeMode) => {
    setThemeAnchor(null)
    setAnchor(null)
    void updateThemeMode(next)
  }

  return (
    <>
      <IconButton onClick={(e) => setAnchor(e.currentTarget)} size="small">
        <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>{initials}</Avatar>
      </IconButton>

      <Menu
        anchorEl={anchor}
        open={!!anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ px: 2, py: 1, minWidth: 200 }}>
          <TextBody1Neutral80 noWrap>{user?.name}</TextBody1Neutral80>
          <TextBody1Neutral60 noWrap>{user?.email}</TextBody1Neutral60>
        </Box>
        <Divider />
        <MenuItem onClick={() => setAnchor(null)}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          {t('home.accountSettings')}
        </MenuItem>
        <MenuItem onClick={(e) => setThemeAnchor(e.currentTarget)}>
          <ListItemIcon>
            <Palette fontSize="small" />
          </ListItemIcon>
          {t('home.theme', { mode: t(`home.theme.${mode}`) })}
          <ChevronRight fontSize="small" sx={{ ml: 'auto' }} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => void handleLogout()}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {t('home.logout')}
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={themeAnchor}
        open={!!themeAnchor}
        onClose={() => setThemeAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {THEME_MODES.map((option) => (
          <MenuItem key={option} selected={option === mode} onClick={() => handleSelectMode(option)}>
            <ListItemIcon>{option === mode && <Check fontSize="small" />}</ListItemIcon>
            {t(`home.theme.${option}`)}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
