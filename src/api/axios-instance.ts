import routes from '@/configs/route.config'
import useRefreshToken from '@/hook/useRefreshToken'
import { ApiResponse } from '@/types/api.type'
import { store } from '@/redux/store'
import { verifyJwtToken } from '@/utils/auth'
import axios, { AxiosError } from 'axios'
import queryString from 'query-string'

export default axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: (params: object) => queryString.stringify(params),
})

export const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: (params: object) => queryString.stringify(params),
})

axiosPrivate.interceptors.request.use(async (config) => {
  const token = store.getState().auth.token

  const hasVerifiedToken = token && (await verifyJwtToken(token))
  if (hasVerifiedToken) {
    const refresh = useRefreshToken()

    try {
      await refresh()
    } catch (err) {
      console.error('Error refresh token: ', err)
      window.location.replace(routes.home)
    }
  }
  config.headers['Authorization'] = `Bearer ${token}`

  return config
})

axiosPrivate.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError<ApiResponse<string>>) => {
    throw error
  },
)

export const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})
