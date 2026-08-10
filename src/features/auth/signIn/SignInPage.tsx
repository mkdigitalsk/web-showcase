import { useForm, Controller } from 'react-hook-form'
import { Routes } from '../../../utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Container } from '@mui/material'
import {
  Button,
  Input,
  TextH4Bold,
  TextBody1Neutral60,
  TextBody1Neutral80,
  TextLinkPrimary,
  AlertError,
} from '../../../shared/components'
import { useTranslation } from '../../../shared/hooks'
import { httpStatus, requestErrorKey } from '../../../shared/api'
import { useSignInMutation } from './useSignInMutation'
import { signInSchema, type SignInFormData } from '../schemas'

const TEST_EMAIL = 'test01@mkdigital.sk'
const TEST_PASSWORD = 'MKDigitalTest1@'
const HTTP_UNAUTHORIZED = 401

export function SignInPage() {
  const { t } = useTranslation()
  const signInMutation = useSignInMutation()

  const { control, handleSubmit, setValue } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
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
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <TextH4Bold align="center" gutterBottom>
          {t('signIn.title')}
        </TextH4Bold>

        <Box
          component="form"
          onSubmit={(event) => void handleSubmit((data) => signInMutation.mutate(data))(event)}
          sx={{ mt: 4 }}
        >
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                label={t('signIn.emailLabel')}
                type="email"
                placeholder={t('signIn.emailPlaceholder')}
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
                label={t('signIn.passwordLabel')}
                type="password"
                placeholder={t('signIn.passwordPlaceholder')}
                error={!!error}
                helperText={error?.message && t(`validation.${error.message}`)}
                margin="normal"
                fullWidth
              />
            )}
          />

          {signInMutation.error && (
            <AlertError sx={{ mt: 2 }}>
              {t(
                httpStatus(signInMutation.error) === HTTP_UNAUTHORIZED
                  ? 'signIn.error'
                  : requestErrorKey(signInMutation.error, 'common.error'),
              )}
            </AlertError>
          )}

          <Button type="submit" loading={signInMutation.isPending} fullWidth size="large" sx={{ mt: 3 }}>
            {t('signIn.button')}
          </Button>
        </Box>

        <Box sx={{ mt: 4, p: 2, bgcolor: 'action.hover', borderRadius: 2, textAlign: 'center' }}>
          <TextBody1Neutral60>{t('signIn.testAccount.hint')}</TextBody1Neutral60>
          <TextBody1Neutral80 sx={{ mt: 1 }}>{TEST_EMAIL}</TextBody1Neutral80>
          <TextBody1Neutral80>{TEST_PASSWORD}</TextBody1Neutral80>
          <Button type="button" variant="outline" onClick={fillTestAccount} sx={{ mt: 2 }}>
            {t('signIn.testAccount.fill')}
          </Button>
        </Box>

        <TextBody1Neutral60 align="center" sx={{ mt: 3 }}>
          {t('signIn.noAccount')} <TextLinkPrimary to={Routes.SIGN_UP}>{t('signIn.signUp')}</TextLinkPrimary>
        </TextBody1Neutral60>
      </Box>
    </Container>
  )
}
