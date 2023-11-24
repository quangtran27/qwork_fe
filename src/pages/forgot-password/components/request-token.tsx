import authApi from '@/api/auth.api'
import Button from '@/components/Button'
import TextInput from '@/components/TextInput'
import routes from '@/configs/route.config'
import { ApiResponse } from '@/types/api.type'
import { Steps } from '@/types/auth.type'
import { RequestResetPasswordSchema, requestResetPasswordSchema } from '@/utils/validators/user'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function RequestToken() {
  const navigate = useNavigate()
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<RequestResetPasswordSchema>({
    mode: 'onSubmit',
    resolver: yupResolver(requestResetPasswordSchema),
  })

  const handleSubmitForm = handleSubmit((data) => {
    requestCodeMutation.mutate(data)
  })

  const requestCodeMutation = useMutation({
    mutationFn: (data: RequestResetPasswordSchema) => authApi.requestResetPasswordToken(data),
    onSuccess: (response) => {
      toast.success(response.message)
      navigate(`?step=${Steps.check}&email=${response.data}`)
    },
    onError: (_err) => {
      const axiosError = _err as AxiosError
      const errReponse = axiosError.response?.data as ApiResponse<string>
      toast.error(`${errReponse.message}`)
    },
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
      <div className='mb-5 mt-2'>
        <p className='mb-2 mt-0'>Hãy nhập email tài khoản của bạn:</p>
        <TextInput
          iconLeft={<FontAwesomeIcon icon={faEnvelope} />}
          placeholder='Nhập địa chỉ email'
          type='text'
          error={!!errors.email}
          errorMessage={errors.email?.message}
          {...register('email')}
        />
      </div>
      <Button loading={requestCodeMutation.isLoading} className='w-full'>
        Gửi mã xác nhận
      </Button>
    </form>
  )
}
