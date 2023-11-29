import authApi from '@/api/auth.api'
import { clearCredential } from '@/redux/reducers/auth-slice'
import { store } from '@/redux/store'

const useLogout = () => {
  const logout = async () => {
    store.dispatch(clearCredential())
    try {
      await authApi.logout()
    } catch {}
  }
  return logout
}

export default useLogout
