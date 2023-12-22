import candidatesApi from '@/api/candidates.api'
import recruitersApi from '@/api/recruiters.api'
import { useAppDispatch } from '@/hook/useAppDispatch'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectProfile } from '@/redux/reducers/auth-slice'
import { setProfile } from '@/redux/reducers/profile-slice'
import { ApiResponse } from '@/types/api.type'
import { ProfileType } from '@/types/profile.type'
import { faImage, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ChangeEventHandler, RefObject, forwardRef, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import Button from './Button'

const UpdateAvatar = forwardRef<HTMLDialogElement>(({}, ref) => {
  const profile = useAppSelector(selectProfile)
  const inputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer>(profile.avatar)
  const dispatch = useAppDispatch()

  const handleChangeImage: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        setPreviewImage(reader.result!)
      }
    }
  }

  const handleCloseModal = () => {
    ;(ref as RefObject<HTMLDialogElement>).current?.close()
  }

  const updateAvatarMutation = useMutation({
    mutationFn: (data: { id: string; image: File }) =>
      profile.type === ProfileType.recruiter
        ? recruitersApi.updateAvatar(data.id, data.image!)
        : candidatesApi.updateAvatar(data.id, data.image!),
    onSuccess: (response) => {
      toast.success('Cập nhật ảnh đại diện thành công!')
      dispatch(setProfile({ ...profile, avatar: response.data }))
      handleCloseModal()
    },
    onError: (_err) => {
      const axiosError = _err as AxiosError
      const errReponse = axiosError.response?.data as ApiResponse<string>
      toast.error(`Cập nhật không thành công: ${errReponse.message}`)
    },
  })

  useEffect(() => {
    setPreviewImage(profile.avatar)
  }, [profile])

  return (
    <dialog id='update-avatar-modal' className='modal' ref={ref}>
      <div className='modal-box max-w-screen-md'>
        <h3 className='text-h3 text-center'>Cập nhật ảnh đại diện</h3>
        <div className='mt-4 flex flex-col items-center justify-center gap-4'>
          <input className='hidden' type='file' accept='image/*' ref={inputRef} onChange={handleChangeImage} />
          <figure className='relative h-80 w-80 overflow-hidden rounded-full'>
            <img className='absolute h-full w-full object-cover' src={previewImage?.toString()} />
          </figure>
          <Button
            color='secondary'
            variant='outline'
            className='min-w-[200px]'
            onClick={() => {
              inputRef.current?.click()
            }}
          >
            <FontAwesomeIcon icon={faImage} />
            Chọn ảnh
          </Button>
          <Button
            className='min-w-[200px]'
            loading={updateAvatarMutation.isPending}
            onClick={() => {
              image && updateAvatarMutation.mutate({ id: profile.id, image: image })
            }}
          >
            <FontAwesomeIcon icon={faSave} />
            Lưu lại
          </Button>
        </div>
        <button className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2' onClick={handleCloseModal}>
          ✕
        </button>
      </div>
      <div className='modal-backdrop bg-black/20' onClick={handleCloseModal} />
    </dialog>
  )
})

UpdateAvatar.displayName = 'UpdateAvatar'
export default UpdateAvatar
