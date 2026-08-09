import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { Routes } from '../../utils'

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
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = Routes.SIGN_IN
    }
    return Promise.reject(error)
  },
)
