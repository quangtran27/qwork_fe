import authApi from '@/api/auth.api'
import { clearCredential, setCredential } from '@/redux/reducers/auth-slice'
import { store } from '@/redux/store'

const useRefreshToken = () => {
  return async () => {
    try {
      const response = await authApi.refreshToken()
      store.dispatch(setCredential(response.data))
    } catch {
      await authApi.logout()
      store.dispatch(clearCredential())
    }
  }
}

export default useRefreshToken
