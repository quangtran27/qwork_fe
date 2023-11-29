import recruitersApi from '@/api/recruiters.api'
import { useAppDispatch } from '@/hook/useAppDispatch'
import { useAppSelector } from '@/hook/useAppSelector'
import { ApiResponse } from '@/types/api.type'
import { ProfileType, RecruiterProfile } from '@/types/profile.type'
import { selectProfile } from '@/redux/reducers/auth-slice'
import { setProfile } from '@/redux/reducers/profile-slice'
import { profileToRecruiterProfile } from '@/utils/converters/profile.converter'
import { recruiterProfileSchema } from '@/utils/validators/profile.validator'
import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Button from '../Button'
import TextInput from '../TextInput'

type Props = {
  handleCloseModal: () => void
}

export default function UpdateRecruiterProfile({ ...props }: Props) {
  const profile = useAppSelector(selectProfile)
  const dispatch = useAppDispatch()
  const recruiterProfile = { ...profileToRecruiterProfile(profile) }

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onSubmit',
    defaultValues: recruiterProfile,
    resolver: yupResolver(recruiterProfileSchema),
  })

  const useUpdateProfile = useMutation({
    mutationFn: (_recruiterProfile: RecruiterProfile) => recruitersApi.updateProfile(profile.id, _recruiterProfile),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Cập nhật thành công')
        dispatch(setProfile({ ...response.data, type: ProfileType.recruiter }))
        props.handleCloseModal()
      }
    },
    onError: (_err) => {
      const axiosError = _err as AxiosError
      const errReponse = axiosError.response?.data as ApiResponse<string>
      toast.error(`Cập nhật không thành công: ${errReponse.message}`)
    },
  })

  const handleSave = handleSubmit((_profile) => {
    useUpdateProfile.mutate(_profile)
  })

  return (
    <form className='mt-4 flex flex-col gap-4' onSubmit={handleSave}>
      <label className='flex w-full flex-col items-start gap-2' htmlFor='candidate-name'>
        <span>Họ và tên:</span>
        <TextInput
          className='w-full'
          id='candidate-name'
          placeholder='Nhập họ và tên'
          error={!!errors.name}
          errorMessage={errors.name?.message}
          {...register('name')}
        />
      </label>
      <label className='flex w-full flex-col items-start gap-2' htmlFor='candidate-phone'>
        <span>Số điện thoại:</span>
        <TextInput
          className='w-full'
          id='candidate-phone'
          placeholder='Nhập số điện thoại'
          error={!!errors.phone}
          errorMessage={errors.phone?.message}
          {...register('phone')}
        />
      </label>
      <label className='flex w-full flex-col items-start gap-2' htmlFor='candidate-address'>
        <span>Địa chỉ:</span>
        <TextInput
          className='w-full'
          id='candidate-address'
          placeholder='Nhập địa chỉ'
          error={!!errors.address}
          errorMessage={errors.address?.message}
          {...register('address')}
        />
      </label>
      <label className='flex w-full flex-col items-start gap-2' htmlFor='candidate-email'>
        <span>Email:</span>
        <TextInput
          className='w-full'
          id='candidate-email'
          placeholder='Nhập email'
          error={!!errors.email}
          errorMessage={errors.email?.message}
          {...register('email')}
        />
      </label>
      <label className='flex w-full flex-col items-start gap-2' htmlFor='candidate-email'>
        <span>Thông tin giới thiệu:</span>
        <textarea
          className='textarea textarea-bordered h-32 w-full rounded-3xl text-base'
          id='candidate-email'
          placeholder='Nhập thông tin giới thiệu'
          {...register('description')}
        />
      </label>
      <div className='flex flex-col'>
        <Button loading={useUpdateProfile.isPending}>Lưu lại</Button>
      </div>
    </form>
  )
}
