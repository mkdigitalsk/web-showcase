import { useContext } from 'react'
import { ColorSchemeContext } from '../context/ColorSchemeContext'
import { requireContext } from '../../utils'

export function useColorScheme() {
  return requireContext(useContext(ColorSchemeContext), 'useColorScheme')
}
