import { useAppSelector } from '@/hook/useAppSelector'
import useRefreshToken from '@/hook/useRefreshToken'
import Loading from '@/pages/loading'
import { selectAuth } from '@/redux/reducers/auth-slice'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

export default function PersistLogin() {
  const token = useAppSelector(selectAuth).token
  const [isLoading, setLoading] = useState(true)
  const refresh = useRefreshToken()

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh()
      } finally {
        setLoading(false)
      }
    }

    !isLoading && !token ? verifyRefreshToken() : setLoading(false)
  }, [isLoading, refresh, token])

  return isLoading ? <Loading /> : <Outlet />
}
