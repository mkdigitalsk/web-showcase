import { redirect } from 'react-router'
import { Routes } from '../utils'

/** The bare origin and every path the app does not have open the first screen, never a blank page. */
export function clientLoader() {
  return redirect(Routes.UI_COMPONENTS)
}
