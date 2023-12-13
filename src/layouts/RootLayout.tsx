import Footer from '@/components/Footer'
import Header from '@/components/Header'
import routes from '@/configs/route.config'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth } from '@/redux/reducers/auth-slice'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

export default function RootLayout() {
  const location = useLocation()
  const isAuthPage =
    [routes.login, routes.register, routes.forgotPassword, routes.registerSuccess, routes.verifyEmail].includes(
      location.pathname,
    ) || location.pathname.includes(routes.resetPassword.split('/')[1])
  const token = useAppSelector(selectAuth).token
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    token && isAuthPage && navigate(searchParams.get('next') ?? routes.home)
  }, [isAuthPage, navigate, searchParams, token])

  return (
    <div className='flex min-h-screen flex-col'>
      {!isAuthPage && (
        <>
          <Header />
          <div className='h-header'></div>
        </>
      )}
      <div className=''></div>
      <main className='flex flex-1 flex-col bg-gradient-to-b from-black/5 to-gray-50 text-slate-700'>
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  )
}
