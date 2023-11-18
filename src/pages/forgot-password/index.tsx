import { Steps } from '@/types/auth.type'
import { Link, useSearchParams } from 'react-router-dom'
import CheckToken from './components/check-token'
import DoneResetPassword from './components/done-reset-password'
import RequestToken from './components/request-token'
import routes from '@/configs/route.config'

export default function ForgotPassword() {
  const [searchParams] = useSearchParams()
  const step = (
    Object.values(Steps).includes((searchParams.get('step') || '') as Steps) ? searchParams.get('step') : Steps.request
  ) as Steps

  return (
    <main className='relative z-20 flex h-screen w-screen select-none items-center justify-center bg-login text-sm'>
      <div className='max-w-full bg-white px-4 py-12 shadow md:rounded-3xl md:p-8'>
        {step === Steps.request && <RequestToken />}
        {step === Steps.check && <CheckToken />}
        {step === Steps.done && <DoneResetPassword />}
        <p className='mt-4 text-center text-base'>
          Đã có tài khoản?{' '}
          <Link className='text-secondary' to={routes.login}>
            Đăng nhập
          </Link>{' '}
          ngay
        </p>
      </div>
    </main>
  )
}
