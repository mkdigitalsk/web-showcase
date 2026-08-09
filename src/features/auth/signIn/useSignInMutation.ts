import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../shared/hooks'
import { Routes } from '../../../utils'

export function useSignInMutation() {
  const navigate = useNavigate()
  const { signIn } = useAuth()

  return useMutation({
    mutationFn: signIn,
    onSuccess: () => navigate(Routes.UI_COMPONENTS),
  })
}
