import { useForm, Controller } from 'react-hook-form'
import { Routes } from '../../../utils'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Input,
  TextH4Bold,
  TextBody1Neutral60,
  TextCaptionNeutral60,
  TextLinkPrimary,
  AlertError,
} from '../../../shared/components'
import { useTranslation } from '../../../shared/hooks'
import { requestErrorKey } from '../../../shared/api'
import { useSignUpMutation } from './useSignUpMutation'
import { DATA_CONTROLLER } from '../../legal/dataController'
import { CentredColumn } from '../CentredColumn'
import { signUpSchema, type SignUpFormData } from '../schemas'
import styles from './SignUpPage.module.css'

export default function SignUpPage() {
  const { t, intl } = useTranslation()
  const signUpMutation = useSignUpMutation()

  const { control, handleSubmit } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <CentredColumn>
      <TextH4Bold align="center">{t('signUp.title')}</TextH4Bold>

      <form
        className={styles.form}
        onSubmit={(event) => void handleSubmit((data) => signUpMutation.mutate(data))(event)}
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
              label={t('signUp.passwordLabel')}
              type="password"
              placeholder={t('signUp.passwordPlaceholder')}
              errorText={error?.message && t(`validation.${error.message}`)}
            />
          )}
        />

        {signUpMutation.error && <AlertError>{t(requestErrorKey(signUpMutation.error, 'signUp.error'))}</AlertError>}

        <Button type="submit" loading={signUpMutation.isPending}>
          {t('signUp.button')}
        </Button>
      </form>

      <TextBody1Neutral60 align="center">
        {t('signUp.hasAccount')} <TextLinkPrimary to={Routes.SIGN_IN}>{t('signUp.signIn')}</TextLinkPrimary>
      </TextBody1Neutral60>

      <TextCaptionNeutral60 align="center">
        {intl.formatMessage(
          { id: 'signUp.terms' },
          { terms: (chunks) => <TextLinkPrimary to={Routes.TERMS}>{chunks}</TextLinkPrimary> },
        )}
      </TextCaptionNeutral60>

      <TextCaptionNeutral60 align="center">
        {intl.formatMessage(
          { id: 'signUp.privacy' },
          {
            controller: DATA_CONTROLLER,
            privacy: (chunks) => <TextLinkPrimary to={Routes.PRIVACY}>{chunks}</TextLinkPrimary>,
          },
        )}
      </TextCaptionNeutral60>
    </CentredColumn>
  )
}
