import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../shared/hooks'
import { Routes } from '../../../utils'

export function useRegisterMutation() {
  const navigate = useNavigate()
  const { register } = useAuth()

  return useMutation({
    mutationFn: register,
    onSuccess: () => navigate(Routes.HOME),
  })
}
