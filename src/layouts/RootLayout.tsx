import Footer from '@/components/Footer'
import Header from '@/components/Header'
import routes from '@/configs/route.config'
import { Outlet, useLocation } from 'react-router-dom'

export default function RootLayout() {
  const location = useLocation()
  const isAuthPage = [routes.login, routes.register].includes(location.pathname)

  return (
    <div className='flex min-h-screen flex-col'>
      {!isAuthPage && <Header />}
      <main className='flex flex-1 flex-col bg-gradient-to-b from-black/5 to-gray-50 text-gray-800'>
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  )
}
