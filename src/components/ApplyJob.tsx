import applicationsApi from '@/api/applications.api'
import { emptyUpdateApplication } from '@/constants/applications.constant'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth } from '@/redux/reducers/auth-slice'
import { ApiResponse } from '@/types/api.type'
import { Application } from '@/types/applications.type'
import { Job } from '@/types/jobs.type'
import { applicationSchema } from '@/utils/validators/application.validator'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { RefObject, forwardRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Button from './Button'
import TextInput from './TextInput'

type ApplyJobProps = Job

const ApplyJob = forwardRef<HTMLDialogElement, ApplyJobProps>(({ id, name }, ref) => {
  const auth = useAppSelector(selectAuth)
  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    setError,
    getValues,
  } = useForm({
    mode: 'onSubmit',
    defaultValues: emptyUpdateApplication,
    resolver: yupResolver(applicationSchema),
  })

  const handleApplyJob = handleSubmit((data) => {
    useCreateApplication.mutate(data as Application)
  })

  const useCreateApplication = useMutation({
    mutationFn: (application: Application) => applicationsApi.createApplication(application),
    onSuccess: () => {
      toast.success('Ứng tuyển thành công!')
      ;(ref as RefObject<HTMLDialogElement>).current?.close()
    },
    onError: (err) => {
      const axiosError = err as AxiosError
      const errReponse = axiosError.response?.data as ApiResponse<string>
      toast.error(`Ứng tuyển không thành công: ${errReponse.message}`)
    },
  })

  useEffect(() => {
    setValue('jobId', id)
    setValue('name', auth.name)
  }, [id, auth, setValue])

  return (
    <dialog id='my_modal_2' className='modal' ref={ref}>
      <div className='modal-box max-w-full p-4 lg:w-[722px] lg:max-w-screen-md lg:p-6'>
        <h3 className='text-h3'>
          Ứng tuyển <span className='text-primary'>{name}</span>{' '}
        </h3>
        <form className='mt-4 flex flex-col gap-4' onSubmit={handleApplyJob}>
          <input type='hidden' {...register('jobId')} />
          <div>
            <label className='mb-2 block' htmlFor='job-name'>
              Họ và tên <span className='text-error'>(*)</span>:
            </label>
            <TextInput
              id='job-name'
              placeholder='Họ và tên'
              error={!!errors.name}
              errorMessage={errors.name?.message}
              {...register('name')}
            />
          </div>
          <div>
            <label className='mb-2 block' htmlFor='job-phone'>
              Số điện thoại <span className='text-error'>(*)</span>:
            </label>
            <TextInput
              id='job-phone'
              placeholder='Số điện thoại'
              error={!!errors.phone}
              errorMessage={errors.phone?.message}
              {...register('phone')}
            />
          </div>
          <div>
            <label className='mb-2 block' htmlFor='job-email'>
              Email <span className='text-error'>(*)</span>:
            </label>
            <TextInput
              id='job-email'
              placeholder='Nhập email'
              error={!!errors.email}
              errorMessage={errors.email?.message}
              {...register('email')}
            />
          </div>
          <div className='flex flex-wrap items-center gap-4'>
            <label className='mb-2 block' htmlFor='job-email'>
              CV <span className='text-error'>(*)</span>:
            </label>
            <input
              type='file'
              accept='application/pdf,application/msword,
  application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              {...register('cv')}
            />
            {errors.cv?.message && <div className='text-error'>{errors.cv?.message}</div>}
          </div>
          <Button
            loading={useCreateApplication.isPending}
            onClick={(e) => {
              e.preventDefault()
              if (!(getValues('cv') as FileList).length) {
                setError('cv', { type: 'onChange', message: 'Vui lòng tải lên CV của bạn' })
              } else {
                handleApplyJob()
              }
            }}
          >
            Ứng tuyển
          </Button>
        </form>
        <form method='dialog'>
          <button className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2'>✕</button>
        </form>
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button>close</button>
      </form>
    </dialog>
  )
})

ApplyJob.displayName = 'ApplyJob'
export default ApplyJob
