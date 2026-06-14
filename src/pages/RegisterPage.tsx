import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import { Button, Input, TextH4Bold, TextBody1Neutral60, TextLinkPrimary, AlertError } from '../components'
import { useAuth } from '../hooks'

export function RegisterPage() {
  const intl = useIntl()
  const navigate = useNavigate()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await register({ name, email, password })
      navigate('/dashboard')
    } catch {
      setError(intl.formatMessage({ id: 'register.error' }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <TextH4Bold align="center" gutterBottom>
          {intl.formatMessage({ id: 'register.title' })}
        </TextH4Bold>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          <Input
            label={intl.formatMessage({ id: 'register.nameLabel' })}
            type="text"
            value={name}
            onChange={setName}
            placeholder={intl.formatMessage({ id: 'register.namePlaceholder' })}
            margin="normal"
            fullWidth
          />

          <Input
            label={intl.formatMessage({ id: 'register.emailLabel' })}
            type="email"
            value={email}
            onChange={setEmail}
            placeholder={intl.formatMessage({ id: 'register.emailPlaceholder' })}
            margin="normal"
            fullWidth
          />

          <Input
            label={intl.formatMessage({ id: 'register.passwordLabel' })}
            type="password"
            value={password}
            onChange={setPassword}
            placeholder={intl.formatMessage({ id: 'register.passwordPlaceholder' })}
            margin="normal"
            fullWidth
          />

          {error && <AlertError sx={{ mt: 2 }}>{error}</AlertError>}

          <Button type="submit" loading={loading} fullWidth size="large" sx={{ mt: 3 }}>
            {intl.formatMessage({ id: 'register.button' })}
          </Button>
        </Box>

        <TextBody1Neutral60 align="center" sx={{ mt: 3 }}>
          {intl.formatMessage({ id: 'register.hasAccount' })}{' '}
          <TextLinkPrimary to="/login">
            {intl.formatMessage({ id: 'register.login' })}
          </TextLinkPrimary>
        </TextBody1Neutral60>
      </Box>
    </Container>
  )
}
