import { useForm, Controller } from 'react-hook-form'
import { Routes } from '../../../utils'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { CentredColumn } from '../CentredColumn'
import { signInSchema, type SignInFormData } from '../schemas'
import styles from './SignInPage.module.css'

const TEST_EMAIL = 'test01@mkdigital.sk'
const TEST_PASSWORD = 'MKDigitalTest1@'
const HTTP_UNAUTHORIZED = 401

export default function SignInPage() {
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
    <CentredColumn>
      <TextH4Bold align="center">{t('signIn.title')}</TextH4Bold>

      <form
        className={styles.form}
        onSubmit={(event) => void handleSubmit((data) => signInMutation.mutate(data))(event)}
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
              errorText={error?.message && t(`validation.${error.message}`)}
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
              errorText={error?.message && t(`validation.${error.message}`)}
            />
          )}
        />

        {signInMutation.error && (
          <AlertError>
            {t(
              httpStatus(signInMutation.error) === HTTP_UNAUTHORIZED
                ? 'signIn.error'
                : requestErrorKey(signInMutation.error, 'common.error'),
            )}
          </AlertError>
        )}

        <Button type="submit" loading={signInMutation.isPending}>
          {t('signIn.button')}
        </Button>
      </form>

      <div className={styles.testAccount}>
        <TextBody1Neutral60>{t('signIn.testAccount.hint')}</TextBody1Neutral60>
        <div>
          <TextBody1Neutral80>{TEST_EMAIL}</TextBody1Neutral80>
          <TextBody1Neutral80>{TEST_PASSWORD}</TextBody1Neutral80>
        </div>
        <Button type="button" variant="outline" onClick={fillTestAccount}>
          {t('signIn.testAccount.fill')}
        </Button>
      </div>

      <TextBody1Neutral60 align="center">
        {t('signIn.noAccount')} <TextLinkPrimary to={Routes.SIGN_UP}>{t('signIn.signUp')}</TextLinkPrimary>
      </TextBody1Neutral60>
    </CentredColumn>
  )
}
