import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Container } from '@mui/material'
import { Button, Input, TextH4Bold, TextBody1Neutral60, TextLinkPrimary, AlertError } from '../../../shared/components'
import { useTranslation } from '../../../shared/hooks'
import { useLoginMutation } from './useLoginMutation'
import { loginSchema, type LoginFormData } from '../schemas'

export function LoginPage() {
  const { t } = useTranslation()
  const loginMutation = useLoginMutation()

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'test@test.com',
      password: 'Kmpshowcase1@',
    },
  })

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
          {t('login.title')}
        </TextH4Bold>

        <Box component="form" onSubmit={handleSubmit((data) => loginMutation.mutate(data))} sx={{ mt: 4 }}>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                label={t('login.emailLabel')}
                type="email"
                placeholder={t('login.emailPlaceholder')}
                error={!!error}
                helperText={error?.message && t(`validation.${error.message}`)}
                margin="normal"
                fullWidth
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                label={t('login.passwordLabel')}
                type="password"
                placeholder={t('login.passwordPlaceholder')}
                error={!!error}
                helperText={error?.message && t(`validation.${error.message}`)}
                margin="normal"
                fullWidth
              />
            )}
          />

          {loginMutation.error && (
            <AlertError sx={{ mt: 2 }}>{t('login.error')}</AlertError>
          )}

          <Button type="submit" loading={loginMutation.isPending} fullWidth size="large" sx={{ mt: 3 }}>
            {t('login.button')}
          </Button>
        </Box>

        <TextBody1Neutral60 align="center" sx={{ mt: 3 }}>
          {t('login.noAccount')}{' '}
          <TextLinkPrimary to="/register">
            {t('login.register')}
          </TextLinkPrimary>
        </TextBody1Neutral60>
      </Box>
    </Container>
  )
}
