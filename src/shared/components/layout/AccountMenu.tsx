import { useNavigate } from 'react-router'
import { useAuth, useTranslation } from '../../hooks'
import type { AuthUser } from '../../types'
import { Routes } from '../../../utils'
import { IconButton } from '../IconButton'
import { Tooltip } from '../Tooltip'
import styles from './AccountMenu.module.css'

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
      <IconButton onClick={() => void navigate(Routes.ACCOUNT)} aria-label={t('home.account.title')}>
        <span className={styles.avatar} aria-hidden>
          {initials}
        </span>
      </IconButton>
    </Tooltip>
  )
}
