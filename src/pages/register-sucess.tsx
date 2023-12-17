import userApi from '@/api/user.api'
import Card from '@/components/Card'
import Loading from '@/components/Loading'
import routes from '@/configs/route.config'
import { ApiResponse } from '@/types/api.type'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function RegisterSuccess() {
  const location = useLocation()
  const { email } = location.state
  const [wait, setWait] = useState(0)

  const sendActivateEmailMutation = useMutation({
    mutationFn: () => userApi.sendActivateEmail(email),
    onSuccess: (response) => {
      toast.success(response.message)
    },
    onError: (err: AxiosError) => {
      toast.error((err.response?.data as ApiResponse<null>).message)
    },
    onSettled: () => {
      setWait(15)
    },
  })

  const handleResendActivateEmail = () => {
    sendActivateEmailMutation.mutate()
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (wait > 0) {
        setWait((prev) => prev - 1)
      }
    }, 1000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [wait])

  useEffect(() => {
    document.title = 'QWork - Đăng ký tài khoản thành công'
  }, [])

  return (
    <main className='relative z-20 flex h-screen w-screen items-center justify-center bg-login'>
      <div className='w-full max-w-xl'>
        <Card>
          <div className='space-y-3'>
            <Link to={routes.home} className='mb-6 flex w-full justify-center'>
              <figure className='relative my-0 h-[44px] w-[120px]'>
                <img src='/images/logo.png' alt='qwork logo' />
              </figure>
            </Link>
            <h3 className='text-h3 text-center'>Xác thực tài khoản email của bạn </h3>
            <div>
              <img src='/images/email.png' className='mx-auto h-36' alt='' />
            </div>
            <p className='px-8 text-center'>
              Chúng tôi đã gửi một email đến <span className='text-primary'>{email}</span> để xác thực tài khoản email
              của bạn. Vui lòng kiểm tra email để kích hoạt tài khoản.
            </p>
            <div className='divider'></div>
            <p className='text-center text-gray-700'>
              Chưa nhận được email?{' '}
              <button disabled={wait > 0} className='font-medium' onClick={handleResendActivateEmail}>
                {sendActivateEmailMutation.isPending ? (
                  <span className='text-gray-400'>
                    <Loading content='Đang gửi' />
                  </span>
                ) : wait === 0 ? (
                  <span className='link-hover'>Gửi lại</span>
                ) : (
                  <span className='text-gray-400'>Gửi lại sau {wait} giây ...</span>
                )}
              </button>
            </p>
            <div className='divider'></div>
            <p className='text-center'>
              Nếu đã kích hoạt, bạn có thể đóng trang này hoặc{' '}
              <Link to={routes.home} className='link-hover font-semibold text-secondary'>
                Quay về trang chủ
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </main>
  )
}
