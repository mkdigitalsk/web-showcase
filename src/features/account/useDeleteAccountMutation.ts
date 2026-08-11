import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../shared/hooks'
import { Routes } from '../../utils'

export function useDeleteAccountMutation() {
  const navigate = useNavigate()
  const { deleteAccount } = useAuth()

  return useMutation({
    mutationFn: deleteAccount,
    // Replacing the entry: Back would otherwise return to a screen reading an account that is gone.
    onSuccess: () => navigate(Routes.SIGN_IN, { replace: true }),
  })
}
