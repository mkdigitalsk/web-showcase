import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../shared/hooks'

export function useLoginMutation() {
  const navigate = useNavigate()
  const { login } = useAuth()

  return useMutation({
    mutationFn: login,
    onSuccess: () => navigate('/dashboard'),
  })
}
