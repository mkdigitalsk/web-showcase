import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { Routes } from '../../utils'
import { StorageKey } from '../enums/storageKey'
import { API_PREFIX } from './apiVersion'

// Injected at build time from API_URL. Empty only in dev, where requests stay same-origin and the dev
// server proxies them; a build without it fails in vite.config.ts rather than reaching here.
const API_BASE_URL = __API_URL__

export const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(StorageKey.TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

// A 401 from the auth routes is a rejected credential the form has to show. Everywhere else it is a
// session that has expired, and only that case earns the document load that discards the app's state.
const isAuthRequest = (url: string | undefined) => url?.startsWith(`${API_PREFIX}/auth/`) === true

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !isAuthRequest(error.config?.url)) {
      localStorage.removeItem(StorageKey.TOKEN)
      window.location.href = Routes.SIGN_IN
    }
    return Promise.reject(error)
  },
)
