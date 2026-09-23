import { redirect } from 'react-router'
import { queryClient } from '../shared/api/queryClient'
import { sessionQueryOptions } from '../shared/auth/session'
import { Routes } from '../utils'

/** The signed-in branch of the route table: nothing under it loads or renders until a session is known. */
export async function clientLoader() {
  const user = await queryClient.ensureQueryData(sessionQueryOptions)
  return user ? null : redirect(Routes.SIGN_IN)
}
