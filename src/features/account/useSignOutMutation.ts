import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { useAuth } from '../../shared/hooks'
import { Routes } from '../../utils'

export function useSignOutMutation() {
  const navigate = useNavigate()
  const { signOut } = useAuth()

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => navigate(Routes.SIGN_IN),
  })
}
