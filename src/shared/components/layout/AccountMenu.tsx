import { Check, ChevronRight, Logout, Palette } from '@mui/icons-material'
import { Avatar, Box, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useTranslation } from '../../hooks'
import type { AuthUser, ThemeMode } from '../../types'
import { Routes } from '../../../utils'
import { Divider } from '../dividers'
import { TextBody1Neutral80 } from '../text'

const THEME_MODES: ThemeMode[] = ['system', 'light', 'dark']

export function AccountMenu() {
  const { user } = useAuth()
  return user ? <SignedInAccountMenu user={user} /> : null
}

function SignedInAccountMenu({ user }: { user: AuthUser }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { signOut, updateThemeMode } = useAuth()
  const { mode = 'system' } = useColorScheme()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [themeAnchor, setThemeAnchor] = useState<HTMLElement | null>(null)

  const initials = user.email.slice(0, 2).toUpperCase()

  const handleSignOut = async () => {
    setAnchor(null)
    await signOut()
    await navigate(Routes.SIGN_IN)
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
          <TextBody1Neutral80 noWrap>{user.email}</TextBody1Neutral80>
        </Box>
        <Divider />
        <MenuItem onClick={(e) => setThemeAnchor(e.currentTarget)}>
          <ListItemIcon>
            <Palette fontSize="small" />
          </ListItemIcon>
          {t('home.theme', { mode: t(`home.theme.${mode}`) })}
          <ChevronRight fontSize="small" sx={{ ml: 'auto' }} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => void handleSignOut()}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {t('home.signOut')}
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
