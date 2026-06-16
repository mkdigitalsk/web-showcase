import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { requireContext } from '../../utils'

export function useAuth() {
  return requireContext(useContext(AuthContext), 'useAuth')
}
