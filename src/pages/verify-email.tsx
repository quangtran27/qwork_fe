import userApi from '@/api/user.api'
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
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function VerifyEmail() {
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<EmailSchema>({
    mode: 'onSubmit',
    resolver: yupResolver(emailSchema),
  })

  const sendActivateEmailMutation = useMutation({
    mutationFn: (email: string) => userApi.sendActivateEmail(email),
    onSuccess: (response) => {
      toast.success(response.message)
    },
    onError: (err: AxiosError) => {
      toast.error((err.response?.data as ApiResponse<null>).message)
    },
  })

  const handleSendActivateEmail = handleSubmit((data) => {
    sendActivateEmailMutation.mutate(data.email)
  })

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
            <form onSubmit={handleSendActivateEmail}>
              <div className='mb-5 mt-2'>
                <TextInput
                  iconLeft={<FontAwesomeIcon className='text-gray-500' icon={faEnvelope} />}
                  placeholder='Nhập địa chỉ email'
                  type='text'
                  error={!!errors.email}
                  errorMessage={errors.email?.message}
                  {...register('email')}
                />
              </div>
              <Button loading={sendActivateEmailMutation.isPending} className='w-full'>
                {sendActivateEmailMutation.isSuccess ? (
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
              <Link className='link-hover text-secondary' to={routes.login}>
                Đăng nhập
              </Link>{' '}
              ngay
            </p>
            <p className='text-center'>
              Nếu đã kích hoạt, bạn có thể đóng trang này hoặc{' '}
              <Link to={routes.home} className='link-hover text-secondary'>
                Quay về trang chủ
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </main>
  )
}
