import { useContext } from 'react'
import { LocaleContext } from '../context/LocaleContext'
import { requireContext } from '../../utils'

export function useLocale() {
  return requireContext(useContext(LocaleContext), 'useLocale')
}
