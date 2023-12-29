import jobsApi from '@/api/jobs.api'
import { emptyUpdateJob } from '@/constants/jobs.constant'
import { City } from '@/types/addresses.type'
import { ApiResponse } from '@/types/api.type'
import { UpdateJob } from '@/types/jobs.type'
import { updateJobSchema } from '@/utils/validators/job.validator'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { ChangeEventHandler, MouseEventHandler, forwardRef, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Button from './Button'
import TextEditor from './TextEditor'
import TextInput from './TextInput'

type UpdateJobProps = {
  cities?: City[]
  mode?: 'create' | 'update'
  job?: UpdateJob
  onSuccess: () => void
  onCancel: () => void
}

const UpdateJob = forwardRef<HTMLDialogElement, UpdateJobProps>(
  ({ cities = [], mode = 'update', job = emptyUpdateJob, onSuccess, onCancel }, ref) => {
    const {
      formState: { errors },
      handleSubmit,
      register,
      setValue,
    } = useForm({
      mode: 'onSubmit',
      defaultValues: job,
      resolver: yupResolver(updateJobSchema),
    })

    const [selectedCity, setSelectedCity] = useState(job.cityCode)
    const formRef = useRef<HTMLFormElement>(null)
    const [editorState, setEditorState] = useState(
      EditorState.createWithContent(convertFromRaw(JSON.parse(job.description))),
    )

    const updateJobMutation = useMutation({
      mutationFn: (job: UpdateJob) => (mode === 'create' ? jobsApi.createJob(job) : jobsApi.updateJob(job)),
      onSuccess: () => {
        toast.success(`${mode === 'create' ? 'Đăng' : 'Cập nhật'} tin tuyển dụng thành công`)
        onSuccess()
      },
      onError: (_err) => {
        const axiosError = _err as AxiosError
        const errReponse = axiosError.response?.data as ApiResponse<string>
        toast.error(`Cập nhật không thành công: ${errReponse.message}`)
      },
    })

    const handlePostJob: MouseEventHandler<HTMLButtonElement> = (e) => {
      e.preventDefault()
      setValue('description', JSON.stringify(convertToRaw(editorState.getCurrentContent())))
      setValue('cityCode', selectedCity)
      setValue('cityName', cities.find((city) => city.code == selectedCity)?.name || 'Đã xảy ra lỗi')
      handleSave()
    }

    const handlePickLocation: ChangeEventHandler<HTMLSelectElement> = (e) => {
      setSelectedCity(parseInt(e.target.value))
    }

    const handleSave = handleSubmit((job) => {
      updateJobMutation.mutate(job)
    })

    useEffect(() => {
      mode === 'update' && setValue('expired', job.expired.split('/').reverse().join('-'))
    }, [job.expired, mode, setValue, job])

    return (
      <dialog className='modal' ref={ref}>
        <div className='modal-box max-w-screen-lg'>
          <h3 className='text-h3'>{mode === 'create' ? 'Đăng tin tuyển dụng mới' : 'Cập nhật tin tuyển dụng'}</h3>
          <form className='mt-4 flex flex-col gap-4' ref={formRef} onSubmit={handleSave}>
            <input type='hidden' {...register('id')} />
            <div className='flex items-center gap-4'>
              <span>Đang tuyển dụng:</span>
              <input type='checkbox' className='toggle toggle-primary' {...register('status')} />
            </div>
            <div>
              <label className='mb-1 block' htmlFor='job-name'>
                Tên công việc:
              </label>
              <TextInput
                id='job-name'
                placeholder='Nhập tên công việc'
                error={!!errors.name}
                errorMessage={errors.name?.message}
                {...register('name')}
              />
            </div>
            <div className='flex'>
              <div className='flex-1'>
                <label className='mb-1 block' htmlFor='job-salary'>
                  Mức lương (Lương thoả thuận, điền 0 và 0):
                </label>
                <div className='flex gap-3'>
                  <TextInput
                    id='job-salary'
                    error={!!errors.salaryFrom}
                    errorMessage={errors.salaryFrom?.message}
                    insideClass='pr-24 text-right'
                    iconLeft={<span className='text-gray-400'>Từ</span>}
                    iconRight={<span className='text-gray-400'>(triệu VNĐ)</span>}
                    min={0}
                    type='number'
                    {...register('salaryFrom')}
                  />
                  <TextInput
                    error={!!errors.salaryTo}
                    errorMessage={errors.salaryTo?.message}
                    insideClass='pr-24 text-right'
                    iconLeft={<span className='text-gray-400'>Đến</span>}
                    iconRight={<span className='text-gray-400'>(triệu VNĐ)</span>}
                    min={0}
                    type='number'
                    {...register('salaryTo')}
                  />
                </div>
              </div>
              <div className='divider divider-horizontal pt-8'></div>
              <div>
                <label className='mb-1 block' htmlFor='job-location'>
                  Địa điểm:
                </label>
                <div className='col-span-3'>
                  <select
                    id='job-location'
                    className='select select-bordered rounded-full text-base'
                    value={selectedCity.toString()}
                    onChange={handlePickLocation}
                  >
                    {cities.map((city) => (
                      <option key={city.code + city.name} value={city.code}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className='flex-1'>
              <label className='mb-1 block'>Ngày hết hạn:</label>
              <input
                className='input input-bordered col-span-2 mr-4 rounded-full'
                type='date'
                {...register('expired')}
              />
              <span>(tháng / ngày / năm)</span>
            </div>
            <div>
              <span className='mb-2 inline-flex'>Mô tả công việc:</span>
              {errors.cityCode?.message && <div className='text-error'>{errors.cityCode?.message}</div>}
              <TextEditor editorState={editorState} setEditorState={setEditorState} />
            </div>
            <Button color='primary' loading={updateJobMutation.isPending} onClick={handlePostJob}>
              {mode === 'create' ? 'Đăng tin' : 'Cập nhật'}
            </Button>
          </form>
          <form method='dialog'>
            <button className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2' onClick={onCancel}>
              ✕
            </button>
          </form>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button onClick={onCancel}>close</button>
        </form>
      </dialog>
    )
  },
)

UpdateJob.displayName = 'UpdateJob'
export default UpdateJob
