import userApi from '@/api/user.api'
import Button from '@/components/Button'
import TextInput from '@/components/TextInput'
import routes from '@/configs/route.config'
import { roleOptions } from '@/constants/users.constant'
import { ApiResponse } from '@/types/api.type'
import { User } from '@/types/users.type'
import { emptyUser } from '@/utils/sample/users'
import { userSchema } from '@/utils/validators/user.validator'
import {
  faChevronLeft,
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faPhone,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Register() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm({
    mode: 'onSubmit',
    defaultValues: emptyUser,
    resolver: yupResolver(userSchema),
  })

  const registerMutation = useMutation({
    mutationFn: (user: User) => userApi.createUser(user),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message)
        navigate(routes.registerSuccess, {
          state: {
            email: response.data.email,
          },
        })
      } else {
        toast.error(response.message)
      }
    },
    onError: (_err) => {
      const axiosError = _err as AxiosError
      const errReponse = axiosError.response?.data as ApiResponse<string>
      toast.error(`Đăng ký không thành công: ${errReponse.message}`)
    },
  })

  const handleRegister = handleSubmit((user) => {
    registerMutation.mutate(user as User)
  })

  useEffect(() => {
    setValue('id', '0')
  }, [setValue])

  return (
    <main className='relative z-20 flex h-screen w-screen items-center justify-center bg-login'>
      <div className='max-w-full bg-white px-4 py-12 shadow-sm md:rounded-3xl md:p-8'>
        <form className='prose w-[442px] max-w-full' onSubmit={handleRegister}>
          <h3 className='text-center'>Chào mừng bạn đến với</h3>
          <Link to={routes.home} className='mb-6 flex w-full justify-center'>
            <figure className='relative my-0 h-[44px] w-[120px]'>
              <img src='/images/logo.png' alt='qwork logo' />
            </figure>
          </Link>
          <div className='mb-6'>
            <TextInput
              iconLeft={<FontAwesomeIcon icon={faUser} />}
              placeholder='Nguyễn Văn A'
              type='text'
              error={!!errors.name}
              errorMessage={errors.name?.message}
              {...register('name')}
            />
            <TextInput
              className='mt-3'
              iconLeft={<FontAwesomeIcon icon={faEnvelope} />}
              placeholder='nguyenvana@gmail.com'
              error={!!errors.email}
              errorMessage={errors.email?.message}
              {...register('email')}
            />
            <TextInput
              className='mt-3'
              iconLeft={<FontAwesomeIcon icon={faPhone} />}
              placeholder='0312345678'
              error={!!errors.phone}
              errorMessage={errors.phone?.message}
              {...register('phone')}
            />
            <TextInput
              className='mt-3'
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
          <Button loading={registerMutation.isPending} className='w-full'>
            Đăng ký
          </Button>
          <p className='text-center'>
            Đã có tài khoản?{' '}
            <Link className='text-secondary' to={routes.login}>
              Đăng nhập
            </Link>{' '}
            ngay
          </p>
        </form>
        <Link to={routes.home} className='link-hover link mt-2'>
          <FontAwesomeIcon icon={faChevronLeft} className='mt-4 text-sm' /> Quay về trang chủ
        </Link>
      </div>
    </main>
  )
}
