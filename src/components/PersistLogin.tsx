import { useAppSelector } from '@/hook/useAppSelector'
import useRefreshToken from '@/hook/useRefreshToken'
import Loading from '@/pages/loading'
import { selectAuth } from '@/redux/reducers/auth-slice'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

export default function PersistLogin() {
  const token = useAppSelector(selectAuth).token
  const refresh = useRefreshToken()
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh()
      } catch (err) {
        console.error('Error persisting login: ' + err)
      } finally {
        setLoading(false)
      }
    }

    !token ? verifyRefreshToken() : setLoading(false)
  }, [isLoading, refresh, token])

  return <>{isLoading ? <Loading /> : <Outlet />}</>
}
