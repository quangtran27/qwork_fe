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
import {
  faBriefcase,
  faCalendar,
  faEnvelope,
  faLocationDot,
  faPhone,
  faSave,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { MouseEventHandler, RefObject, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import TextEditor from '../TextEditor'

type UpdateCandidateProfileProps = {
  parentRef: RefObject<HTMLDialogElement>
}

export default function UpdateCandidateProfile({ ...props }: UpdateCandidateProfileProps) {
  const profile = useAppSelector(selectProfile)
  const dispatch = useAppDispatch()
  const candidateProfile = { ...profileToCandidateProfile(profile) }
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
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
      }
      props.parentRef.current?.close()
    },
    onError: (_err) => {
      const axiosError = _err as AxiosError
      const errReponse = axiosError.response?.data as ApiResponse<string>
      toast.error(`Cập nhật không thành công: ${errReponse.message}`)
    },
  })

  const handleUpdateProfile: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    setValue('description', JSON.stringify(convertToRaw(editorState.getCurrentContent())))
    handleSave()
  }

  const handleSave = handleSubmit((_profile) => {
    console.log(_profile)
    useUpdateProfile.mutate(_profile)
  })

  useEffect(() => {
    try {
      setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(profile.description))))
    } catch {}
  }, [profile.description])

  return (
    <form className='mt-4 flex flex-col gap-4' onSubmit={handleSave}>
      <div>
        <div className='flex items-center gap-4'>
          <span className='font-medium'>Bật tìm việc:</span>
          <input type='checkbox' className='toggle toggle-primary' {...register('available')} />
        </div>
        <p className='my-3 text-sm text-slate-500'>
          Khi bật tìm việc, các nhà tuyển dụng sẽ có thể tìm kiếm và xem hồ sơ cá nhân của bạn
        </p>
      </div>
      <label className='space-y-2'>
        <span className='font-medium'>Họ và tên:</span>
        <TextInput
          className='w-full'
          iconLeft={<FontAwesomeIcon className='text-gray-500' icon={faUser} />}
          placeholder='Nhập họ và tên......'
          error={!!errors.name}
          errorMessage={errors.name?.message}
          {...register('name')}
        />
      </label>
      <label className='space-y-2'>
        <span className='font-medium'>Vị trí:</span>
        <TextInput
          className='w-full'
          iconLeft={<FontAwesomeIcon className='text-gray-500' icon={faBriefcase} />}
          placeholder='Nhập ngày sinh...'
          error={!!errors.position}
          errorMessage={errors.position?.message}
          {...register('position')}
        />
      </label>
      <label className='space-y-2'>
        <span className='font-medium'>Ngày sinh:</span>
        <div className='flex w-full flex-col gap-2 lg:flex-row lg:items-center'>
          <div className='relative'>
            <span className='absolute inset-y-0 left-0 flex items-center pl-4'>
              <FontAwesomeIcon className='text-gray-500' icon={faCalendar} />
            </span>
            <input
              className='input input-bordered mr-4 w-full rounded-full pl-10 lg:w-fit'
              placeholder='dd-mm-yyyy...'
              type='date'
              {...register('birthDay')}
            />
          </div>
          <span className='text-gray-500'>(tháng / ngày / năm)</span>
        </div>
      </label>
      <Controller
        name='gender'
        control={control}
        render={({ field }) => (
          <>
            <div className='space-y-2'>
              <span className='font-medium'>Giới tính:</span>
              <div className='flex gap-3'>
                {genderOptions.map((option) => {
                  return (
                    <div key={option.value} className='mr-4 flex items-center'>
                      <input
                        type='radio'
                        className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600'
                        {...field}
                        checked={option.value === field.value}
                        value={option.value}
                      />
                      <label htmlFor={`role-${option.value}`} className='ml-2 text-gray-900'>
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
      <label className='space-y-2'>
        <span className='font-medium'>Địa chỉ:</span>
        <TextInput
          className='w-full'
          iconLeft={<FontAwesomeIcon className='text-gray-500' icon={faLocationDot} />}
          placeholder='Nhập địa chỉ...'
          error={!!errors.address}
          errorMessage={errors.address?.message}
          {...register('address')}
        />
      </label>
      <label className='space-y-2'>
        <span className='font-medium'>Số điện thoại:</span>
        <TextInput
          className='w-full'
          iconLeft={<FontAwesomeIcon icon={faPhone} />}
          placeholder='Nhập số điện thoại...'
          error={!!errors.phone}
          errorMessage={errors.phone?.message}
          {...register('phone')}
        />
      </label>
      <label className='space-y-2'>
        <span className='font-medium'>Email:</span>
        <TextInput
          className='w-full'
          iconLeft={<FontAwesomeIcon icon={faEnvelope} />}
          placeholder='Nhập email...'
          error={!!errors.email}
          errorMessage={errors.email?.message}
          {...register('email')}
        />
      </label>
      <div>
        <span className='mb-2 inline-flex font-medium'>Thông tin giới thiệu:</span>
        {errors.description?.message && <div className='text-error'>{errors.description?.message}</div>}
        <TextEditor editorState={editorState} setEditorState={setEditorState} />
      </div>
      <div className='flex flex-col'>
        <span></span>
        <Button className='w-full' loading={useUpdateProfile.isPending} onClick={handleUpdateProfile}>
          <FontAwesomeIcon icon={faSave} />
          Lưu lại
        </Button>
      </div>
    </form>
  )
}
