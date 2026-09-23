import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../shared/hooks'
import { Routes } from '../../utils'

/**
 * On success the sign-in screen replaces the history entry: Back would otherwise return to a screen
 * reading an account that is gone.
 */
export function useDeleteAccountMutation() {
  const navigate = useNavigate()
  const { deleteAccount } = useAuth()

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => navigate(Routes.SIGN_IN, { replace: true }),
  })
}
