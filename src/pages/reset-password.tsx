import authApi from '@/api/auth.api'
import Button from '@/components/Button'
import Card from '@/components/Card'
import TextInput from '@/components/TextInput'
import routes from '@/configs/route.config'
import { ApiResponse } from '@/types/api.type'
import { ResetPasswordSchema, resetPasswordSchema } from '@/utils/validators/user.validator'
import { faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function ResetPassword() {
  const { email, token } = useParams()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<ResetPasswordSchema>({
    mode: 'onSubmit',
    resolver: yupResolver(resetPasswordSchema),
  })

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordSchema) => authApi.resetPassword(data),
    onSuccess: (response) => {
      toast.success(response.message)
      navigate(routes.login)
    },
    onError: (err: AxiosError) => {
      toast.error((err.response?.data as ApiResponse<null>).message)
    },
  })

  const handleSubmitForm = handleSubmit((data) => {
    resetPasswordMutation.mutate(data)
  })

  useEffect(() => {
    if (email && token) {
      setValue('email', email)
      setValue('token', token)
    }
  }, [email, setValue, token])

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
            <h3 className='text-h3 text-center'>Đặt lại mật khẩu của bạn</h3>
            <div>
              <img className='mx-auto h-32' src='/images/password-reset.jpg' alt='qwork-reset-password' />
            </div>
            <form onSubmit={handleSubmitForm}>
              <div className='my-3 space-y-3'>
                <label className='text-base'>Điền mật khẩu mới của bạn:</label>
                <TextInput
                  iconLeft={<FontAwesomeIcon icon={faLock} />}
                  placeholder='••••••••'
                  type={showPassword ? 'text' : 'password'}
                  iconRight={
                    <span className='cursor-pointer select-none' onClick={() => setShowPassword((prev) => !prev)}>
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </span>
                  }
                  error={!!errors.password}
                  errorMessage={errors.password?.message}
                  {...register('password')}
                />
              </div>
              <Button loading={resetPasswordMutation.isPending} className='w-full'>
                Đặt lại mật khẩu
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
