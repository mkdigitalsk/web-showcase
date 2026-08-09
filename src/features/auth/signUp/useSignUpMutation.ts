import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../shared/hooks'
import { Routes } from '../../../utils'

export function useSignUpMutation() {
  const navigate = useNavigate()
  const { signUp } = useAuth()

  return useMutation({
    mutationFn: signUp,
    onSuccess: () => navigate(Routes.UI_COMPONENTS),
  })
}
