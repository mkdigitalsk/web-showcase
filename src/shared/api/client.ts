import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { Routes } from '../../utils'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

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
  (error: AxiosError) => Promise.reject(error)
)

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = Routes.LOGIN
    }
    return Promise.reject(error)
  }
)
