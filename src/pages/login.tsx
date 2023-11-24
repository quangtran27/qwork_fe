import authApi from '@/api/auth.api'
import Button from '@/components/Button'
import TextInput from '@/components/TextInput'
import routes from '@/configs/route.config'
import { roleOptions } from '@/constants/users.constant'
import { useAppDispatch } from '@/hook/useAppDispatch'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth, setCredential } from '@/redux/reducers/auth-slice'
import { ApiResponse } from '@/types/api.type'
import { LoginUser } from '@/types/users.type'
import { emptyLoginUser } from '@/utils/sample/users'
import { loginUserSchema } from '@/utils/validators/user'
import { faChevronLeft, faEnvelope, faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next')
  const [showPassword, setShowPassword] = useState(false)

  const token = useAppSelector(selectAuth).token

  useEffect(() => {
    if (token) navigate(next ?? routes.home)
  }, [token, navigate, next])

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    mode: 'onSubmit',
    defaultValues: emptyLoginUser,
    resolver: yupResolver(loginUserSchema),
  })

  const mutation = useMutation({
    mutationFn: (loginUser: LoginUser) => authApi.login(loginUser),
    onSuccess: (response) => {
      if (response.success) {
        dispatch(setCredential(response.data))
        console.log('next: ', next)
        navigate(next ?? routes.home)
      } else {
        toast.error(`Đăng nhập không thành công: ${response.message}`)
      }
    },
    onError: (response: AxiosError) => {
      toast.error(`Đăng nhập không thành công: ${(response.response?.data as ApiResponse<string>).message}`)
    },
  })

  const handleLogin = handleSubmit((loginUser) => {
    mutation.mutate(loginUser as LoginUser)
  })

  return (
    <main className='relative z-20 flex h-screen w-screen max-w-full items-center justify-center bg-login text-sm'>
      <div className='max-w-full bg-white p-4 py-12 md:rounded-2xl md:p-8'>
        <form className='prose w-[442px] max-w-full' onSubmit={handleLogin}>
          <h3 className='text-center'>Chào mừng bạn đã quay trở lại với</h3>
          <div className='mb-6 flex w-full justify-center'>
            <Link to={routes.home}>
              <figure className='relative my-0 h-[44px] w-[120px]'>
                <img src='/images/logo.png' alt='qwork logo' className='absolute h-full w-full' />
              </figure>
            </Link>
          </div>
          <div className='my-2'>
            <TextInput
              iconLeft={<FontAwesomeIcon icon={faEnvelope} />}
              placeholder='Nhập địa chỉ email'
              type='text'
              error={!!errors.email}
              errorMessage={errors.email?.message}
              {...register('email')}
            />
            <TextInput
              className='mt-3'
              placeholder='Nhập mật khẩu'
              type={showPassword ? 'text' : 'password'}
              iconLeft={<FontAwesomeIcon icon={faLock} />}
              iconRight={
                <span className='cursor-pointer select-none' onClick={() => setShowPassword((prev) => !prev)}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              }
              error={!!errors.password}
              errorMessage={errors.password?.message}
              {...register('password')}
            />
            <Controller
              name='role'
              control={control}
              render={({ field }) => (
                <>
                  <div className='flex px-4'>
                    {roleOptions.map((option) => {
                      return (
                        <div key={option.value} className='mr-4 mt-3 flex items-center'>
                          <input
                            id={`role-${option.value}`}
                            type='radio'
                            className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600'
                            {...field}
                            checked={option.value === field.value}
                            value={option.value}
                          />
                          <label htmlFor={`role-${option.value}`} className='ml-2'>
                            {option.display}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                  {errors.role?.message && <div className='px-4 text-error'>{errors.role?.message}</div>}
                </>
              )}
            />
          </div>
          <Link className='mb-2 block py-2 text-right text-secondary' to={'/forgot-password'}>
            Quên mật khẩu?
          </Link>
          <Button loading={mutation.isLoading} className='w-full'>
            Đăng nhập
          </Button>
          <p className='text-center'>
            Chưa có tài khoản?{' '}
            <Link className='text-secondary' to={routes.register}>
              Đăng ký
            </Link>{' '}
            ngay
          </p>
        </form>
        <Link to={routes.home} className='link-hover link mt-2 text-base'>
          <FontAwesomeIcon icon={faChevronLeft} className='mt-4 text-sm' /> Quay về trang chủ
        </Link>
      </div>
    </main>
  )
}
