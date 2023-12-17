import authApi from '@/api/auth.api'
import AccountSettingMenu from '@/components/AccountSettingMenu'
import Button from '@/components/Button'
import Card from '@/components/Card'
import TextInput from '@/components/TextInput'
import { ApiResponse } from '@/types/api.type'
import { UpdatePasswordSchema, updatePasswordSchema } from '@/utils/validators/user.validator'
import { faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

export default function ChangePassword() {
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  useEffect(() => {
    document.title = 'QWork - Đổi mật khẩu'
  }, [])

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<UpdatePasswordSchema>({
    resolver: yupResolver(updatePasswordSchema),
  })

  const updatePasswordMutation = useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) => authApi.changePassword(data),
    onSuccess: () => {
      toast.success('Cập nhật mật khẩu thành công!')
      reset()
    },
    onError: (_err) => {
      const axiosError = _err as AxiosError
      const errReponse = axiosError.response?.data as ApiResponse<string>
      toast.error(`Cập nhật không thành công: ${errReponse.message}`)
    },
  })

  const handleUpdatePassword = handleSubmit((data) => {
    updatePasswordMutation.mutate(data)
  })

  return (
    <div className='mx-auto w-full max-w-screen-xl'>
      <div className='grid grid-cols-3 gap-4 py-4'>
        <div className='col-span-3 lg:col-span-1'>
          <AccountSettingMenu />{' '}
        </div>
        <div className='col-span-3 lg:col-span-2'>
          <Card>
            <div className='space-y-3'>
              <h3 className='text-h3'>Cập nhật mật khẩu</h3>
              <form className='space-y-3' onSubmit={handleUpdatePassword}>
                <div className='space-y-3'>
                  <label className='font-medium'>Mật khẩu cũ:</label>
                  <TextInput
                    placeholder='Nhập mật khẩu cũ...'
                    type={showOldPassword ? 'text' : 'password'}
                    error={!!errors.oldPassword}
                    errorMessage={errors.oldPassword?.message}
                    iconLeft={<FontAwesomeIcon icon={faLock} />}
                    iconRight={
                      <span className='cursor-pointer select-none' onClick={() => setShowOldPassword((prev) => !prev)}>
                        <FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye} />
                      </span>
                    }
                    {...register('oldPassword')}
                  />
                </div>
                <div className='space-y-3'>
                  <label className='font-medium'>Mật khẩu mới:</label>
                  <TextInput
                    placeholder='Nhập mật khẩu mới...'
                    type={showNewPassword ? 'text' : 'password'}
                    error={!!errors.newPassword}
                    errorMessage={errors.newPassword?.message}
                    iconLeft={<FontAwesomeIcon icon={faLock} />}
                    iconRight={
                      <span className='cursor-pointer select-none' onClick={() => setShowNewPassword((prev) => !prev)}>
                        <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                      </span>
                    }
                    {...register('newPassword')}
                  />
                </div>
                <div>
                  <Button loading={updatePasswordMutation.isPending} className='mt-3 w-full'>
                    Lưu lại
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
