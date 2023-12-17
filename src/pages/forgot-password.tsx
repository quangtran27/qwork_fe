import authApi from '@/api/auth.api'
import Button from '@/components/Button'
import Card from '@/components/Card'
import TextInput from '@/components/TextInput'
import routes from '@/configs/route.config'
import { ApiResponse } from '@/types/api.type'
import { EmailSchema, emailSchema } from '@/utils/validators/user.validator'
import { faEnvelope, faRedo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function ForgotPassword() {
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<EmailSchema>({
    mode: 'onSubmit',
    resolver: yupResolver(emailSchema),
  })

  useEffect(() => {
    document.title = 'QWork - Quên mật khẩu'
  }, [])

  const requestResetPasswordMutation = useMutation({
    mutationFn: (data: EmailSchema) => authApi.requestResetPasswordToken(data),
    onSuccess: (response) => {
      toast.success(response.message)
    },
    onError: (err: AxiosError) => {
      toast.error((err.response?.data as ApiResponse<null>).message)
    },
  })

  const handleSubmitForm = handleSubmit((data) => {
    requestResetPasswordMutation.mutate(data)
  })

  return (
    <main className='relative z-20 flex h-screen min-h-screen w-screen select-none items-center justify-center bg-login text-sm'>
      <div className='w-full max-w-xl'>
        <Card>
          <div className='space-y-3'>
            <Link to={routes.home} className='mb-6 flex w-full justify-center'>
              <figure className='relative my-0 h-[44px] w-[120px]'>
                <img src='/images/logo.png' alt='qwork logo' />
              </figure>
            </Link>
            <h3 className='text-h3 text-center'>Yêu cầu đặt lại mật khẩu của bạn</h3>
            <div>
              <img className='mx-auto h-32' src='/images/password-reset.jpg' alt='qwork-reset-password' />
            </div>
            <form onSubmit={handleSubmitForm}>
              <div className='mb-5 mt-2'>
                <TextInput
                  iconLeft={<FontAwesomeIcon className='text-gray-500' icon={faEnvelope} />}
                  placeholder='Nhập địa chỉ email...'
                  type='text'
                  error={!!errors.email}
                  errorMessage={errors.email?.message}
                  {...register('email')}
                />
              </div>
              <Button loading={requestResetPasswordMutation.isPending} className='w-full'>
                {requestResetPasswordMutation.isSuccess ? (
                  <>
                    <FontAwesomeIcon icon={faRedo} />
                    Gửi lại
                  </>
                ) : (
                  'Gửi mã xác nhận'
                )}
              </Button>
            </form>
            <p className='text-center'>
              Đã có tài khoản?{' '}
              <Link className='text-secondary' to={routes.login}>
                Đăng nhập
              </Link>{' '}
              ngay
            </p>
          </div>
        </Card>
      </div>
    </main>
  )
}
