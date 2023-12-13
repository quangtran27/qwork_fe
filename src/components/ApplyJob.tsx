import applicationsApi from '@/api/applications.api'
import { emptyUpdateApplication } from '@/constants/applications.constant'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth } from '@/redux/reducers/auth-slice'
import { ApiResponse } from '@/types/api.type'
import { Application } from '@/types/applications.type'
import { Job } from '@/types/jobs.type'
import { applicationSchema } from '@/utils/validators/application.validator'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Dispatch, MouseEventHandler, RefObject, forwardRef, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from './Button'
import TextInput from './TextInput'

type ApplyJobProps = Job & {
  CVs: string[]
  setJobApplied: Dispatch<React.SetStateAction<boolean>>
}

const ApplyJob = forwardRef<HTMLDialogElement, ApplyJobProps>(({ ...props }, ref) => {
  const auth = useAppSelector(selectAuth)
  const [useOldCV, setUseOldCV] = useState(!!props.CVs.at(0))
  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    setError,
    clearErrors,
    getValues,
  } = useForm({
    mode: 'onSubmit',
    defaultValues: emptyUpdateApplication,
    resolver: yupResolver(applicationSchema),
  })

  const handleSubmitForm = (oldCv?: string) => {
    return handleSubmit((data) => {
      useCreateApplication.mutate({ application: data as Application, oldCv: oldCv })
    })
  }

  const handleApplyJob: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    if (useOldCV) {
      handleSubmitForm(props.CVs[0])()
    } else {
      if (!(getValues('cv') as FileList).length) {
        setError('cv', { type: 'onChange', message: 'Vui lòng tải lên CV của bạn' })
      } else {
        handleSubmitForm()()
      }
    }
  }

  const useCreateApplication = useMutation({
    mutationFn: ({ application, oldCv }: { application: Application; oldCv?: string }) =>
      applicationsApi.createApplication(application, oldCv),
    onSuccess: () => {
      toast.success('Ứng tuyển thành công!')
      props.setJobApplied(true)
      ;(ref as RefObject<HTMLDialogElement>).current?.close()
    },
    onError: (err) => {
      const axiosError = err as AxiosError
      const errReponse = axiosError.response?.data as ApiResponse<string>
      toast.error(`Ứng tuyển không thành công: ${errReponse.message}`)
    },
  })

  useEffect(() => {
    setValue('jobId', props.id)
    setValue('name', auth.user.name)
    setValue('phone', auth.user.phone)
    setValue('email', auth.user.email)
  }, [props.id, auth, setValue])

  return (
    <dialog id='my_modal_2' className='modal' ref={ref}>
      <div className='modal-box max-w-full p-4 lg:w-[722px] lg:max-w-screen-md lg:p-6'>
        <h3 className='text-h3'>
          Ứng tuyển <span className='text-primary'>{props.name}</span>{' '}
        </h3>
        <form className='mt-4 space-y-4' onSubmit={handleSubmitForm()}>
          <div>
            <span className='text-error'>(*)</span> Các thông tin bắt buộc
          </div>
          <input type='hidden' {...register('jobId')} />
          <div className='space-y-2'>
            <label className='font-medium' htmlFor='job-name'>
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
          <div className='space-y-2'>
            <label className='font-medium' htmlFor='job-phone'>
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
          <div className='space-y-2'>
            <label className='font-medium' htmlFor='job-email'>
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
          <div className='space-y-2'>
            <div className='font-medium'>
              Chọn CV để ứng tuyển: <span className='text-error'>(*)</span>:
            </div>
            <div
              className={`${
                useOldCV ? 'border-primary bg-blue-100' : ' bg-gray-100'
              } flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors`}
              onClick={() => {
                setUseOldCV(true)
              }}
            >
              <input type='radio' className='cursor-pointer' checked={useOldCV} readOnly />
              <div className='space-y-3'>
                <div className='whitespace-nowrap'>Dùng CV gần đây nhất</div>
                {!!props.CVs.at(0) ? (
                  <Link className='text-primary' to={props.CVs[0]!} target='_blank'>
                    {props.CVs[0].split('/').pop()}
                  </Link>
                ) : (
                  <div>Bạn chưa ứng tuyển công việc nào trên QWork</div>
                )}
              </div>
            </div>
            <div
              className={`${
                !useOldCV ? 'border-primary bg-blue-100' : ' bg-gray-100'
              } flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors`}
              onClick={() => {
                setUseOldCV(false)
              }}
            >
              <input type='radio' className='cursor-pointer' checked={!useOldCV} readOnly />
              <div className='space-y-2'>
                <div>Tải lên CV của bạn (chỉ hỗ trợ định dạng PDF/Word kích thước tối đa: 5MB)</div>
                <input
                  type='file'
                  accept='application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                  {...register('cv')}
                  onChange={() => {
                    clearErrors('cv')
                  }}
                />
              </div>
            </div>
            {!useOldCV && errors.cv?.message && <div className='text-error'>{errors.cv?.message}</div>}
          </div>
          <Button loading={useCreateApplication.isPending} className='w-full' onClick={handleApplyJob}>
            <FontAwesomeIcon icon={faPaperPlane} />
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
