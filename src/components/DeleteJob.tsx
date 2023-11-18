import jobsApi from '@/api/jobs.api'
import { ApiResponse } from '@/types/api.type'
import { AxiosError } from 'axios'
import { forwardRef } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import Button from './Button'

type DeleteJobProps = {
  id: string
  onSuccess: () => void
  onCancel: () => void
}

const DeleteJob = forwardRef<HTMLDialogElement, DeleteJobProps>(({ id, onSuccess, onCancel }, ref) => {
  const useDeleteJob = useMutation({
    mutationFn: (id: string) => jobsApi.delete(id),
    onSuccess: (response) => {
      toast.success(response.message)
      onSuccess()
    },
    onError: (_err) => {
      const axiosError = _err as AxiosError
      const errReponse = axiosError.response?.data as ApiResponse<string>
      toast.error(`Cập nhật không thành công: ${errReponse.message}`)
    },
  })

  return (
    <dialog id='my_modal_2' className='modal' ref={ref}>
      <div className='modal-box'>
        <h3 className='text-h3 mb-4'>Xoá tin tuyển dụng</h3>
        <p>Bạn có chắc chắn muốn xoá tin tuyển dụng này? Bạn sẽ không thể khôi lại sau khi đã xoá.</p>
        <div className='flex w-full justify-end gap-3'>
          <form method='dialog'>
            <Button color='default' onClick={onCancel}>
              Huỷ bỏ
            </Button>
            <button className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2' onClick={onCancel}>
              ✕
            </button>
          </form>
          <Button
            color='error'
            loading={useDeleteJob.isLoading}
            onClick={() => {
              useDeleteJob.mutate(id)
            }}
          >
            Vẫn xoá
          </Button>
        </div>
      </div>
      <form method='dialog' className='modal-backdrop bg-black/20'>
        <button onClick={onCancel}>close</button>
      </form>
    </dialog>
  )
})

DeleteJob.displayName = 'DeleteJob'
export default DeleteJob
