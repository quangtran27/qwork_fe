import authApi from '@/api/auth.api'
import { ApiResponse } from '@/types/api.type'
import { updatePasswordSchema } from '@/utils/validators/user'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { InferType } from 'yup'
import Button from './Button'
import TextInput from './TextInput'

type UpdatePasswordProps = object
type UpdatePasswordSchema = InferType<typeof updatePasswordSchema>

export default function UpdatePassword({}: UpdatePasswordProps) {
  const navigate = useNavigate()
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const handleCloseModal = () => {
    navigate('')
  }

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<UpdatePasswordSchema>({
    resolver: yupResolver(updatePasswordSchema),
  })

  const useUpdatePassword = useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) => authApi.changePassword(data),
    onSuccess: () => {
      toast.success('Cập nhật mật khẩu thành công!')
      handleCloseModal()
    },
    onError: (_err) => {
      const axiosError = _err as AxiosError
      const errReponse = axiosError.response?.data as ApiResponse<string>
      toast.error(`Cập nhật không thành công: ${errReponse.message}`)
    },
  })

  const handleUpdatePassword = handleSubmit((data) => {
    useUpdatePassword.mutate(data)
  })

  return (
    <dialog id='update-avatar-modal' className='modal' open>
      <div className='max-w-screen-xs modal-box p-4 lg:p-6'>
        <h3 className='text-h3 text-center'>Cập nhật mật khẩu</h3>
        <form className='mt-4 flex flex-col items-center justify-center gap-4' onSubmit={handleUpdatePassword}>
          <div className='w-full'>
            <label className='mb-1 block' htmlFor='old-password'>
              Mật khẩu cũ:
            </label>
            <TextInput
              placeholder='Nhập mật khẩu cũ'
              type={showOldPassword ? 'text' : 'password'}
              iconRight={
                <span className='cursor-pointer select-none' onClick={() => setShowOldPassword((prev) => !prev)}>
                  <FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye} />
                </span>
              }
              {...register('oldPassword')}
            />
            {errors.oldPassword?.message && <div className='ml-4 mt-2 text-error'>{errors.oldPassword?.message}</div>}
          </div>
          <div className='w-full'>
            <label className='mb-1 block' htmlFor='old-password'>
              Mật khẩu mới:
            </label>
            <TextInput
              placeholder='Nhập mật khẩu mới'
              type={showNewPassword ? 'text' : 'password'}
              iconRight={
                <span className='cursor-pointer select-none' onClick={() => setShowNewPassword((prev) => !prev)}>
                  <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                </span>
              }
              {...register('newPassword')}
            />
            {errors.newPassword?.message && <div className='ml-4 mt-2 text-error'>{errors.newPassword?.message}</div>}
          </div>
          <Button className='w-full' loading={useUpdatePassword.isLoading}>
            Lưu lại
          </Button>
        </form>
        <button className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2' onClick={handleCloseModal}>
          ✕
        </button>
      </div>
      <div className='modal-backdrop bg-black/20' onClick={handleCloseModal} />
    </dialog>
  )
}
