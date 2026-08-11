import { Avatar, IconButton, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth, useTranslation } from '../../hooks'
import type { AuthUser } from '../../types'
import { Routes } from '../../../utils'

export function AccountMenu() {
  const { user } = useAuth()
  return user ? <AccountLink user={user} /> : null
}

function AccountLink({ user }: { user: AuthUser }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const initials = user.email.slice(0, 2).toUpperCase()

  return (
    <Tooltip title={user.email}>
      <IconButton onClick={() => void navigate(Routes.ACCOUNT)} size="small" aria-label={t('home.account.title')}>
        <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>{initials}</Avatar>
      </IconButton>
    </Tooltip>
  )
}
