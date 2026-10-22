import { useState } from 'react'
import { DeleteIcon, SignOutIcon } from '../../shared/components/icons/catalog'
import {
  AlertError,
  Button,
  Card,
  PageContainer,
  PageHeader,
  TextBody1Neutral60,
  TextBody1Neutral80,
  TextCaptionNeutral60,
} from '../../shared/components'
import { requestErrorKey } from '../../shared/api'
import { useAuth, useTranslation } from '../../shared/hooks'
import { DeleteAccountDialog } from './components/DeleteAccountDialog'
import { useDeleteAccountMutation } from './useDeleteAccountMutation'
import { useSignOutMutation } from './useSignOutMutation'
import styles from './AccountPage.module.css'

export default function AccountPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [isConfirming, setIsConfirming] = useState(false)
  const signOut = useSignOutMutation()
  const deleteAccount = useDeleteAccountMutation()

  const closeDialog = () => {
    if (deleteAccount.isPending) return
    deleteAccount.reset()
    setIsConfirming(false)
  }

  return (
    <PageContainer>
      <PageHeader title={t('account.title')} description={t('account.subtitle')} />

      <div className={styles.sections}>
        <Card className={styles.card}>
          <TextCaptionNeutral60>{t('account.email')}</TextCaptionNeutral60>
          <TextBody1Neutral80>{user?.email}</TextBody1Neutral80>
        </Card>

        <div className={styles.action}>
          <div>
            <Button
              variant="outline"
              startIcon={<SignOutIcon />}
              loading={signOut.isPending}
              onClick={() => signOut.mutate()}
            >
              {t('home.signOut')}
            </Button>
          </div>
          {signOut.error && <AlertError>{t(requestErrorKey(signOut.error, 'common.error'))}</AlertError>}
        </div>

        <div>
          {user?.demo ? (
            <TextBody1Neutral60>{t('account.deleteDemo')}</TextBody1Neutral60>
          ) : (
            <Button destructive startIcon={<DeleteIcon />} onClick={() => setIsConfirming(true)}>
              {t('account.delete')}
            </Button>
          )}
        </div>
      </div>

      {isConfirming && (
        <DeleteAccountDialog
          error={deleteAccount.error}
          isDeleting={deleteAccount.isPending}
          onCancel={closeDialog}
          onConfirm={() => deleteAccount.mutate()}
        />
      )}
    </PageContainer>
  )
}
