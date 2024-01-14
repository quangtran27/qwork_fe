import recruitersApi from '@/api/recruiters.api'
import { useAppDispatch } from '@/hook/useAppDispatch'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectProfile } from '@/redux/reducers/auth-slice'
import { setProfile } from '@/redux/reducers/profile-slice'
import { ApiResponse } from '@/types/api.type'
import { faImage, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ChangeEventHandler, RefObject, forwardRef, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import Button from './Button'

const UpdateBackground = forwardRef<HTMLDialogElement>(({}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const profile = useAppSelector(selectProfile)
  const [image, setImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer>(profile.background!)
  const dispatch = useAppDispatch()

  const handleChangeImage: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    console.log(file)
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        setPreviewImage(reader.result!)
      }
    }
  }

  const udpateBackgroundMutation = useMutation({
    mutationFn: (data: { id: string; image: File }) => recruitersApi.updateBackground(data.id, data.image),
    onSuccess: (response) => {
      toast.success(response.message)
      dispatch(setProfile({ ...profile, background: response.data }))
      handleCloseModal()
    },
    onError: (_err) => {
      const axiosError = _err as AxiosError
      const errReponse = axiosError.response?.data as ApiResponse<string>
      toast.error(`Cập nhật không thành công: ${errReponse.message}`)
    },
  })

  const handleCloseModal = () => {
    ;(ref as RefObject<HTMLDialogElement>).current?.close()
  }

  useEffect(() => {
    setPreviewImage(profile.background)
  }, [profile])

  return (
    <dialog id='update-avatar-modal' className='modal' ref={ref}>
      <div className='modal-box max-w-screen-2xl'>
        <h3 className='text-h3 text-center'>Cập nhật ảnh bìa</h3>
        <div className='mt-4 flex flex-col items-center justify-center gap-4'>
          <input className='hidden' type='file' accept='image/*' ref={inputRef} onChange={handleChangeImage} />
          <div
            className='aspect-background relative w-full border bg-cover bg-no-repeat shadow'
            style={{ backgroundImage: `url('${previewImage}')` }}
          />
          <div className='flex gap-4'>
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
              color='primary'
              loading={udpateBackgroundMutation.isPending}
              onClick={() => {
                image && udpateBackgroundMutation.mutate({ id: profile.id, image: image })
              }}
            >
              <FontAwesomeIcon icon={faSave} />
              Lưu lại
            </Button>
          </div>
        </div>
        <button className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2' onClick={handleCloseModal}>
          ✕
        </button>
      </div>
      <form className='modal-backdrop bg-black/20'>
        <button className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2'>✕</button>
        <button>close</button>
      </form>
    </dialog>
  )
})

UpdateBackground.displayName = 'UpdateBackground'
export default UpdateBackground
