import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Container } from '@mui/material'
import { Button, Input, TextH4Bold, TextBody1Neutral60, TextBody1Neutral80, TextLinkPrimary, AlertError } from '../../../shared/components'
import { useTranslation } from '../../../shared/hooks'
import { useLoginMutation } from './useLoginMutation'
import { loginSchema, type LoginFormData } from '../schemas'

const TEST_EMAIL = 'test01@test.com'
const TEST_PASSWORD = 'Kmpshowcase1@'

export function LoginPage() {
  const { t } = useTranslation()
  const loginMutation = useLoginMutation()

  const { control, handleSubmit, setValue } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const fillTestAccount = () => {
    setValue('email', TEST_EMAIL, { shouldValidate: true })
    setValue('password', TEST_PASSWORD, { shouldValidate: true })
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

        <Box sx={{ mt: 4, p: 2, bgcolor: 'action.hover', borderRadius: 2, textAlign: 'center' }}>
          <TextBody1Neutral60>{t('login.testAccount.hint')}</TextBody1Neutral60>
          <TextBody1Neutral80 sx={{ mt: 1 }}>{TEST_EMAIL}</TextBody1Neutral80>
          <TextBody1Neutral80>{TEST_PASSWORD}</TextBody1Neutral80>
          <Button type="button" variant="outline" onClick={fillTestAccount} sx={{ mt: 2 }}>
            {t('login.testAccount.fill')}
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
