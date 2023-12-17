import userApi from '@/api/user.api'
import AccountSettingMenu from '@/components/AccountSettingMenu'
import Button from '@/components/Button'
import Card from '@/components/Card'
import TextInput from '@/components/TextInput'
import { useAppDispatch } from '@/hook/useAppDispatch'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth, setCredential } from '@/redux/reducers/auth-slice'
import { ApiResponse } from '@/types/api.type'
import { UpdateUserInfoSchema } from '@/utils/validators/user.validator'
import { faEnvelope, faPhone, faSave, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

export default function Account() {
  const auth = useAppSelector(selectAuth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    document.title = 'QWork - Quản lý tài khoản'
  }, [])

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<UpdateUserInfoSchema>({
    mode: 'onSubmit',
    defaultValues: {
      name: auth.user.name,
      phone: auth.user.phone,
    },
  })

  const updateUserInfoMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInfoSchema }) => userApi.updateInfo(id, data),
    onSuccess: (response) => {
      toast.success(response.message)
      dispatch(setCredential({ token: auth.token, user: response.data }))
    },
    onError: (err: AxiosError) => {
      toast.error('Đã xảy ra lỗi: ' + (err.response?.data as ApiResponse<null>).message)
      setValue('name', auth.user.name)
      setValue('phone', auth.user.phone)
    },
  })

  const handleUpdate = handleSubmit((data) => {
    updateUserInfoMutation.mutate({ id: auth.user.id, data: data })
  })

  useEffect(() => {
    setValue('name', auth.user.name)
    setValue('phone', auth.user.phone)
  }, [auth, setValue])

  return (
    <div className='mx-auto w-full max-w-screen-xl'>
      <div className='grid grid-cols-3 gap-4 py-4'>
        <div className='col-span-3 lg:col-span-1'>
          <AccountSettingMenu />
        </div>
        <div className='col-span-3 lg:col-span-2'>
          <Card>
            <div className='space-y-3'>
              <h3 className='text-h3'>Cập nhật thông tin tài khoản</h3>
              <div>
                <span className='text-error'>(*)</span> Các thông tin bắt buộc
              </div>
              <form className='space-y-3' onSubmit={handleUpdate}>
                <div className='space-y-3'>
                  <label className='font-medium'>
                    Họ và tên: <span className='text-error'>(*)</span>
                  </label>
                  <TextInput
                    placeholder='Nhập họ và tên...'
                    iconLeft={<FontAwesomeIcon icon={faUser} />}
                    error={!!errors.name}
                    errorMessage={errors.name?.message}
                    {...register('name')}
                  />
                </div>
                <div className='space-y-3'>
                  <label className='font-medium'>
                    Số điện thoại: <span className='text-error'>(*)</span>
                  </label>
                  <TextInput
                    iconLeft={<FontAwesomeIcon icon={faPhone} />}
                    placeholder='Nhập số điện thoại'
                    error={!!errors.phone}
                    errorMessage={errors.phone?.message}
                    {...register('phone')}
                  />
                </div>
                <div className='space-y-3'>
                  <label className='font-medium'>
                    Email: <span className='text-error'>(*)</span>
                  </label>
                  <TextInput
                    readOnly
                    disabled
                    iconLeft={<FontAwesomeIcon icon={faEnvelope} />}
                    value={auth.user.email}
                  />
                </div>
                <div>
                  <Button loading={updateUserInfoMutation.isPending} className='mt-3 w-full'>
                    <FontAwesomeIcon icon={faSave} />
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
