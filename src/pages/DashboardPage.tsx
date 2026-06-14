import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { AppBar, Box, Container, Toolbar } from '@mui/material'
import { Button, TextH6Bold, TextBody1Neutral60 } from '../components'
import { useAuth } from '../hooks'

export function DashboardPage() {
  const intl = useIntl()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <TextH6Bold component="h1" sx={{ flexGrow: 1 }}>
            {intl.formatMessage({ id: 'dashboard.title' })}
          </TextH6Bold>
          <TextBody1Neutral60 sx={{ mr: 2 }}>
            {intl.formatMessage({ id: 'dashboard.welcome' })}, {user?.name}
          </TextBody1Neutral60>
          <Button onClick={handleLogout} variant="secondary">
            {intl.formatMessage({ id: 'dashboard.logout' })}
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <TextBody1Neutral60>
          Dashboard content will go here.
        </TextBody1Neutral60>
      </Container>
    </Box>
  )
}
