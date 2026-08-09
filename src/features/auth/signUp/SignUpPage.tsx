import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Container } from '@mui/material'
import { Button, Input, TextH4Bold, TextBody1Neutral60, TextLinkPrimary, AlertError } from '../../../shared/components'
import { useTranslation } from '../../../shared/hooks'
import { requestErrorKey } from '../../../shared/api'
import { useSignUpMutation } from './useSignUpMutation'
import { signUpSchema, type SignUpFormData } from '../schemas'

export function SignUpPage() {
  const { t } = useTranslation()
  const signUpMutation = useSignUpMutation()

  const { control, handleSubmit } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
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
          {t('signUp.title')}
        </TextH4Bold>

        <Box
          component="form"
          onSubmit={(event) => void handleSubmit((data) => signUpMutation.mutate(data))(event)}
          sx={{ mt: 4 }}
        >
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                label={t('signUp.emailLabel')}
                type="email"
                placeholder={t('signUp.emailPlaceholder')}
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
                label={t('signUp.passwordLabel')}
                type="password"
                placeholder={t('signUp.passwordPlaceholder')}
                error={!!error}
                helperText={error?.message && t(`validation.${error.message}`)}
                margin="normal"
                fullWidth
              />
            )}
          />

          {signUpMutation.error && (
            <AlertError sx={{ mt: 2 }}>{t(requestErrorKey(signUpMutation.error, 'signUp.error'))}</AlertError>
          )}

          <Button type="submit" loading={signUpMutation.isPending} fullWidth size="large" sx={{ mt: 3 }}>
            {t('signUp.button')}
          </Button>
        </Box>

        <TextBody1Neutral60 align="center" sx={{ mt: 3 }}>
          {t('signUp.hasAccount')} <TextLinkPrimary to="/signIn">{t('signUp.signIn')}</TextLinkPrimary>
        </TextBody1Neutral60>
      </Box>
    </Container>
  )
}
