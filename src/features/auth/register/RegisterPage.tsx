import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Container } from '@mui/material'
import { Button, Input, TextH4Bold, TextBody1Neutral60, TextLinkPrimary, AlertError } from '../../../shared/components'
import { useTranslation } from '../../../shared/hooks'
import { useRegisterMutation } from './useRegisterMutation'
import { registerSchema, type RegisterFormData } from '../schemas'

export function RegisterPage() {
  const { t } = useTranslation()
  const registerMutation = useRegisterMutation()

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
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
          {t('register.title')}
        </TextH4Bold>

        <Box component="form" onSubmit={handleSubmit((data) => registerMutation.mutate(data))} sx={{ mt: 4 }}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                label={t('register.nameLabel')}
                type="text"
                placeholder={t('register.namePlaceholder')}
                error={!!error}
                helperText={error?.message && t(`validation.${error.message}`)}
                margin="normal"
                fullWidth
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                label={t('register.emailLabel')}
                type="email"
                placeholder={t('register.emailPlaceholder')}
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
                label={t('register.passwordLabel')}
                type="password"
                placeholder={t('register.passwordPlaceholder')}
                error={!!error}
                helperText={error?.message && t(`validation.${error.message}`)}
                margin="normal"
                fullWidth
              />
            )}
          />

          {registerMutation.error && (
            <AlertError sx={{ mt: 2 }}>{t('register.error')}</AlertError>
          )}

          <Button type="submit" loading={registerMutation.isPending} fullWidth size="large" sx={{ mt: 3 }}>
            {t('register.button')}
          </Button>
        </Box>

        <TextBody1Neutral60 align="center" sx={{ mt: 3 }}>
          {t('register.hasAccount')}{' '}
          <TextLinkPrimary to="/login">
            {t('register.login')}
          </TextLinkPrimary>
        </TextBody1Neutral60>
      </Box>
    </Container>
  )
}
