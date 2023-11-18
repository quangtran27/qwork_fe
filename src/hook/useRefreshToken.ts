import authApi from '@/api/auth.api'
import { setCredential } from '@/redux/reducers/auth-slice'
import { store } from '@/redux/store'

const useRefreshToken = () => {
  const refresh = async () => {
    const response = await authApi.refreshToken()
    if (!response.success) throw new Error()
    store.dispatch(setCredential(response.data))
    return response.data.token
  }
  return refresh
}

export default useRefreshToken
