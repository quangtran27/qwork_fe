import authApi from '@/api/auth.api'
import Button from '@/components/Button'
import TextInput from '@/components/TextInput'
import routes from '@/configs/route.config'
import { ApiResponse } from '@/types/api.type'
import { SetNewPasswordSchema, setNewPasswordSchema } from '@/utils/validators/user'
import { faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function DoneResetPassword() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const token = searchParams.get('token') || ''

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
  } = useForm<SetNewPasswordSchema>({
    mode: 'onSubmit',
    resolver: yupResolver(setNewPasswordSchema),
  })

  const setNewPasswordMutation = useMutation({
    mutationFn: (data: SetNewPasswordSchema) => authApi.doneResetPassword(data),
    onSuccess: (data) => {
      toast.success(data.message)
      navigate(routes.login)
    },
    onError: (_err) => {
      const axiosError = _err as AxiosError
      const errReponse = axiosError.response?.data as ApiResponse<string>
      toast.error(`${errReponse.message}`)
    },
  })

  const handleSetNewPassword = handleSubmit((data) => {
    setNewPasswordMutation.mutate(data)
  })

  useEffect(() => {
    setValue('email', email)
    setValue('token', token)
  }, [email, token, setValue])

  return (
    <form className='prose w-[442px] max-w-full' onSubmit={handleSetNewPassword}>
      <h3 className='text-center'>Lấy lại mật khẩu </h3>
      <div className='mb-6 flex w-full justify-center'>
        <Link to={routes.home}>
          <figure className='relative my-0 h-[44px] w-[120px] select-none'>
            <img src='/images/logo.png' alt='qwork logo' className='absolute h-full w-full' />
          </figure>
        </Link>
      </div>
      <p className='mb-2 mt-0'>Điền mật khẩu mới:</p>
      <div className='mb-5 mt-2'>
        <TextInput
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
      </div>
      <Button className='w-full'>Lưu lại</Button>
    </form>
  )
}
