import recruitersApi from '@/api/recruiters.api'
import { useAppDispatch } from '@/hook/useAppDispatch'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectProfile } from '@/redux/reducers/auth-slice'
import { setProfile } from '@/redux/reducers/profile-slice'
import { ApiResponse } from '@/types/api.type'
import { ProfileType, RecruiterProfile } from '@/types/profile.type'
import { profileToRecruiterProfile } from '@/utils/converters/profile.converter'
import { recruiterProfileSchema } from '@/utils/validators/profile.validator'
import { faEnvelope, faLocationDot, faPhone, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { MouseEventHandler, RefObject, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Button from '../Button'
import TextEditor from '../TextEditor'
import TextInput from '../TextInput'

type Props = {
  parentRef: RefObject<HTMLDialogElement>
}

export default function UpdateRecruiterProfile({ ...props }: Props) {
  const profile = useAppSelector(selectProfile)
  const dispatch = useAppDispatch()
  const recruiterProfile = { ...profileToRecruiterProfile(profile) }
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
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
        props.parentRef.current?.close()
      }
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
    useUpdateProfile.mutate(_profile)
  })

  useEffect(() => {
    setValue('name', profile.name)
    setValue('phone', profile.phone)
    setValue('address', profile.address)
    setValue('email', profile.email)

    try {
      setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(profile.description))))
    } catch {}
  }, [profile.description])

  return (
    <form className='mt-4 flex flex-col gap-4' onSubmit={handleSave}>
      <div className='flex w-full flex-col items-start gap-2'>
        <span className='font-medium'>Họ và tên:</span>
        <TextInput
          className='w-full'
          iconLeft={<FontAwesomeIcon icon={faUser} />}
          placeholder='Nhập tên công ty/tổ chức...'
          error={!!errors.name}
          errorMessage={errors.name?.message}
          {...register('name')}
        />
      </div>
      <div className='flex w-full flex-col items-start gap-2'>
        <span className='font-medium'>Số điện thoại:</span>
        <TextInput
          className='w-full'
          iconLeft={<FontAwesomeIcon icon={faPhone} />}
          placeholder='Nhập số điện thoại...'
          error={!!errors.phone}
          errorMessage={errors.phone?.message}
          {...register('phone')}
        />
      </div>
      <div className='flex w-full flex-col items-start gap-2'>
        <span className='font-medium'>Địa chỉ:</span>
        <TextInput
          className='w-full'
          iconLeft={<FontAwesomeIcon icon={faLocationDot} />}
          placeholder='Nhập địa chỉ...'
          error={!!errors.address}
          errorMessage={errors.address?.message}
          {...register('address')}
        />
      </div>
      <div className='flex w-full flex-col items-start gap-2'>
        <span className='font-medium'>Email:</span>
        <TextInput
          className='w-full'
          iconLeft={<FontAwesomeIcon icon={faEnvelope} />}
          placeholder='Nhập email...'
          error={!!errors.email}
          errorMessage={errors.email?.message}
          {...register('email')}
        />
      </div>
      <div>
        <span className='mb-2 inline-flex font-medium'>Thông tin giới thiệu:</span>
        {errors.description?.message && <div className='text-error'>{errors.description?.message}</div>}
        <TextEditor editorState={editorState} setEditorState={setEditorState} />
      </div>
      <div className='flex flex-col'>
        <Button loading={useUpdateProfile.isPending} color='primary' onClick={handleUpdateProfile}>
          Lưu lại
        </Button>
      </div>
    </form>
  )
}
