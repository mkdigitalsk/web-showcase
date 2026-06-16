import { Logout, Palette, Settings } from '@mui/icons-material'
import { Avatar, Box, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useTranslation } from '../../hooks'
import { Routes } from '../../../utils'
import { Divider } from '../dividers'
import { TextBody1Neutral60, TextBody1Neutral80 } from '../text'

export function AccountMenu() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

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
        <MenuItem onClick={() => setAnchor(null)}>
          <ListItemIcon>
            <Palette fontSize="small" />
          </ListItemIcon>
          {t('home.theme')}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => void handleLogout()}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {t('home.logout')}
        </MenuItem>
      </Menu>
    </>
  )
}
