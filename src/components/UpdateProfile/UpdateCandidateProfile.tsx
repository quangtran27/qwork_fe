import candidatesApi from '@/api/candidates.api'
import Button from '@/components/Button'
import TextInput from '@/components/TextInput'
import { useAppDispatch } from '@/hook/useAppDispatch'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectProfile } from '@/redux/reducers/auth-slice'
import { setProfile } from '@/redux/reducers/profile-slice'
import { ApiResponse } from '@/types/api.type'
import { CandidateProfile, ProfileType, genderOptions } from '@/types/profile.type'
import { profileToCandidateProfile } from '@/utils/converters/profile.converter'
import { candidateProfileSchema } from '@/utils/validators/profile.validator'
import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

type UpdateCandidateProfileProps = {
  handleCloseModal: () => void
}

export default function UpdateCandidateProfile({ ...props }: UpdateCandidateProfileProps) {
  const profile = useAppSelector(selectProfile)
  const dispatch = useAppDispatch()

  const candidateProfile = { ...profileToCandidateProfile(profile) }

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    mode: 'onSubmit',
    defaultValues: candidateProfile,
    resolver: yupResolver(candidateProfileSchema),
  })

  const useUpdateProfile = useMutation({
    mutationFn: (_candidateProfile: CandidateProfile) => candidatesApi.updateProfile(profile.id, _candidateProfile),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Cập nhật thành công')
        dispatch(setProfile({ ...response.data, type: ProfileType.candidate }))
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
    console.log(_profile)
    useUpdateProfile.mutate(_profile)
  })

  return (
    <form className='mt-4 flex flex-col gap-4' onSubmit={handleSave}>
      <label className='flex flex-col items-start gap-2' htmlFor='candidate-name'>
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
      <label className='flex flex-col items-start gap-2' htmlFor='candidate-birthday'>
        <span>Vị trí:</span>
        <TextInput
          className='w-full'
          id='candidate-birthday'
          placeholder='Nhập ngày sinh'
          error={!!errors.position}
          errorMessage={errors.position?.message}
          {...register('position')}
        />
      </label>
      <label className='flex flex-col items-start gap-2' htmlFor='candidate-birthday'>
        <span>Ngày sinh:</span>
        <div className='flex w-full flex-col gap-2 lg:flex-row lg:items-center'>
          <input
            className='input input-bordered mr-4 w-full rounded-full lg:w-fit'
            placeholder='dd-mm-yyyy'
            type='date'
            {...register('birthDay')}
          />
          <span>(tháng / ngày / năm)</span>
        </div>
      </label>
      <Controller
        name='gender'
        control={control}
        render={({ field }) => (
          <>
            <div className='flex flex-col items-start gap-2'>
              <span>Giới tính::</span>
              <div className='flex gap-3'>
                {genderOptions.map((option) => {
                  return (
                    <div key={option.value} className='mr-4 flex items-center'>
                      <input
                        id={`role-${option.value}`}
                        type='radio'
                        className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600'
                        {...field}
                        checked={option.value === field.value}
                        value={option.value}
                      />
                      <label
                        htmlFor={`role-${option.value}`}
                        className='ml-2 font-medium text-gray-900 dark:text-gray-300'
                      >
                        {option.label}
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>
            {errors.gender?.message && <div className='px-4 text-error'>{errors.gender?.message}</div>}
          </>
        )}
      />
      <label className='flex flex-col items-start gap-2' htmlFor='candidate-address'>
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
      <label className='flex flex-col items-start gap-2' htmlFor='candidate-phone'>
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
      <label className='flex flex-col items-start gap-2' htmlFor='candidate-email'>
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
      <label className='flex flex-col items-start gap-2' htmlFor='candidate-email'>
        <span>Thông tin giới thiệu:</span>
        <textarea
          className='textarea textarea-bordered flex h-32 w-full items-start rounded-3xl text-base'
          id='candidate-email'
          placeholder='Nhập thông tin giới thiệu'
          {...register('description')}
        />
      </label>
      <div className='flex flex-col'>
        <span></span>
        <Button className='w-full' loading={useUpdateProfile.isLoading}>
          Lưu lại
        </Button>
      </div>
    </form>
  )
}
