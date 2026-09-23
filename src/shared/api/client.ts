import axios, { type AxiosError } from 'axios'
import { Routes } from '../../utils'
import { API_PREFIX } from './apiVersion'

/**
 * Same-origin in every environment: the app's own proxy answers `/v1`, adds the session as the bearer and holds
 * the API's address — the bundle never carries it.
 */
export const client = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * A 401 from the auth routes is a rejected credential the form has to show. Everywhere else it is a
 * session that has expired, and only that case earns the document load that discards the app's state.
 */
const isAuthRequest = (url: string | undefined) => url?.startsWith(`${API_PREFIX}/auth/`) === true

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !isAuthRequest(error.config?.url)) {
      window.location.href = Routes.SIGN_IN
    }
    return Promise.reject(error)
  },
)
