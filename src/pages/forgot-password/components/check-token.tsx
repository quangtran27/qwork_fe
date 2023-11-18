import authApi from '@/api/auth.api'
import Button from '@/components/Button'
import TextInput from '@/components/TextInput'
import routes from '@/configs/route.config'
import { ApiResponse } from '@/types/api.type'
import { Steps } from '@/types/auth.type'
import { CheckResetPasswordCodeSchema, checkResetPasswordCodeSchema } from '@/utils/validators/user'
import { faCode } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function CheckToken() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    getValues,
  } = useForm<CheckResetPasswordCodeSchema>({
    mode: 'onSubmit',
    resolver: yupResolver(checkResetPasswordCodeSchema),
  })

  const checkTokenMutation = useMutation({
    mutationFn: (data: CheckResetPasswordCodeSchema) => authApi.checkRequessPasswordToken(data),
    onSuccess: (response) => {
      toast.success(response.message)
      navigate(`?step=${Steps.done}&token=${getValues('token')}&email=${getValues('email')}`)
    },
    onError: (_err) => {
      const axiosError = _err as AxiosError
      const errReponse = axiosError.response?.data as ApiResponse<string>
      toast.error(`${errReponse.message}`)
    },
  })

  useEffect(() => {
    setValue('email', email)
  }, [email, setValue])

  const handleSubmitForm = handleSubmit((data) => {
    checkTokenMutation.mutate(data)
  })

  return (
    <form className='prose w-[442px] max-w-full' onSubmit={handleSubmitForm}>
      <h3 className='text-center'>Lấy lại mật khẩu </h3>
      <div className='mb-6 flex w-full justify-center'>
        <Link to={routes.home}>
          <figure className='relative my-0 h-[44px] w-[120px] select-none'>
            <img src='/images/logo.png' alt='qwork logo' className='absolute h-full w-full' />
          </figure>
        </Link>
      </div>
      <p className='mb-2 mt-0'>Nhập mã xác nhận đã được gửi đến trong email:</p>
      <input type='hidden' {...register('email')} />
      <div className='my-2'>
        <TextInput
          className='mb-3'
          iconLeft={<FontAwesomeIcon icon={faCode} />}
          placeholder='Nhập mã xác nhận'
          type='text'
          error={!!errors.token}
          errorMessage={errors.token?.message}
          {...register('token')}
        />
      </div>
      <Button className='w-full'>Xác nhận</Button>
    </form>
  )
}
