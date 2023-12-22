import routes from '@/configs/route.config'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth, selectProfile } from '@/redux/reducers/auth-slice'
import { ApiResponse } from '@/types/api.type'
import { ApplicationStatusEnum, ApplicationDetail as IApplicationDetail } from '@/types/applications.type'
import { UserRoles } from '@/types/users.type'
import { applicationStatusToString } from '@/utils/converters/application.converter'
import { ReviewApplicationSchema, reviewApplicationSchema } from '@/utils/validators/application.validator'
import { faCheck, faEye, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { yupResolver } from '@hookform/resolvers/yup'
import { UseMutationResult } from '@tanstack/react-query'
import { forwardRef } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Button from './Button'
import Card from './Card'
import { toast } from 'react-toastify'

type ApplicationDetailProps = IApplicationDetail & {
  updateApplicationMutation: UseMutationResult<ApiResponse<IApplicationDetail>, Error, object | undefined, unknown>
}

const ApplicationDetail = forwardRef<HTMLDialogElement, ApplicationDetailProps>(({ ...props }, ref) => {
  const profile = useAppSelector(selectProfile)
  const auth = useAppSelector(selectAuth)
  const [statusContent, statusClass] = applicationStatusToString(props.status)

  const {
    formState: { errors },
    register,
    getValues,
    setValue,
    handleSubmit,
  } = useForm<ReviewApplicationSchema>({
    mode: 'onSubmit',
    resolver: yupResolver(reviewApplicationSchema),
  })

  const handleSubmitForm = handleSubmit((data) => {
    props.updateApplicationMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Cập nhật thành công!')
      },
    })
  })

  const handleDownloadCV = async () => {
    try {
      const downloadLink = document.createElement('a')
      downloadLink.href = props.cv
      downloadLink.target = '_blank'
      downloadLink.download = `CV ${props.jobName} - ${props.name}.${props.cv.split('.').pop()}`
      downloadLink.click()
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  return (
    <>
      <dialog id={`application_detail_${props.id}`} className='modal' ref={ref}>
        <div className='modal-box h-screen max-h-screen w-screen max-w-[100vw] cursor-default space-y-3 rounded-none bg-gray-100'>
          <h3 className='text-h3'>Chi tiết đơn ứng tuyển</h3>
          <div className='mt-4 flex justify-between text-sm'>
            <div className='text-gray-500'>Ứng tuyển vào {props.created}</div>
            <div className='flex items-center gap-3'>
              <div>
                Trạng thái: <span className={`${statusClass} badge`}>{statusContent}</span>
              </div>
              <div className='text-gray-500'>Cập nhật: {props.updated}</div>
            </div>
          </div>
          <div className='grid grid-cols-4 gap-4'>
            <div className='col-span-3'>
              <div>
                {props.cv && (
                  <>
                    <iframe
                      id={props.id}
                      src={`https://docs.google.com/gview?url=${props.cv}&embedded=true`}
                      // src={`https://view.officeapps.live.com/op/embed.aspx?src=${props.cv}`}
                      // sandbox='allow-same-origin allow-scripts allow-popups allow-forms'
                      // referrerPolicy='strict-origin-when-cross-origin'
                      className='h-[calc(100vh-140px)] w-full'
                    />
                  </>
                )}
              </div>
            </div>
            <div className='space-y-4'>
              <Link className='flex items-center gap-3' to={routes.profile.replace(':id', props.candidateUserId)}>
                <img className='h-14 w-14 overflow-hidden rounded-full object-cover' src={props.candidateAvatar} />
                <div>
                  <h5 className='text-base font-semibold'>{props.candidateName}</h5>
                  <div className='text-sm'>{props.candidatePosition}</div>
                </div>
              </Link>
              <Card size='sm'>
                <div className='space-y-2'>
                  <div className='space-x-2'>
                    <span className='font-semibold'>Họ và tên:</span>
                    <span>{props.name}</span>
                  </div>
                  <div className='space-x-2'>
                    <span className='font-semibold'>Email:</span>
                    <span>{props.email}</span>
                  </div>
                  <div className='space-x-2'>
                    <span className='font-semibold'>Số điện thoại:</span>
                    <span>{props.phone}</span>
                  </div>
                </div>
              </Card>
              <Card size='sm'>
                <div className='space-y-2'>
                  <div className='space-x-2'>
                    <span className='font-semibold'>Công việc:</span>
                    <Link className='text-primary' to={routes.jobDetail.replace(':id', props.jobId)}>
                      {props.jobName}
                    </Link>
                  </div>
                  {auth.user.role === UserRoles.candidate && (
                    <div className='space-x-2'>
                      <span className='font-semibold'>Từ:</span>
                      <Link className='link-hover' to={routes.jobDetail.replace(':id', props.recruiterName)}>
                        {props.recruiterName}
                      </Link>
                    </div>
                  )}
                </div>
              </Card>
              <Button variant='outline' className='w-full' color='primary' onClick={handleDownloadCV}>
                Xem CV Gốc <FontAwesomeIcon icon={faEye} />
              </Button>
              {profile.userId === props.recruiterUserId && props.status === ApplicationStatusEnum.Is_Considering && (
                <>
                  <div className='divider'></div>
                  <form className='space-y-2' onSubmit={handleSubmitForm}>
                    <h3 className='font-semibold'>Đánh giá:</h3>
                    <div className='ml-2 flex flex-wrap justify-start gap-2'>
                      <Button
                        size='sm'
                        color={getValues('status') === ApplicationStatusEnum.Is_Approved ? 'success' : 'default'}
                        onClick={() => {
                          setValue('status', ApplicationStatusEnum.Is_Approved)
                        }}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                        Hồ sơ phù hợp
                      </Button>
                      <Button
                        size='sm'
                        color={getValues('status') === ApplicationStatusEnum.Is_Rejected ? 'error' : 'default'}
                        onClick={() => {
                          setValue('status', ApplicationStatusEnum.Is_Rejected)
                        }}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                        Hồ sơ chưa phù hợp
                      </Button>
                    </div>
                    {errors.status && <div className='text-sm text-error'>{errors.status.message}</div>}
                    <div className='mt-2'>
                      <div className='mb-1'>
                        Ghi chú <span className='italic text-gray-500'>(Sẽ được gửi cho ứng cử viên)</span>:
                      </div>
                      <textarea
                        className='textarea textarea-bordered w-full rounded-xl'
                        placeholder='Nhập đánh giá'
                        {...register('note')}
                      />
                      {errors.note && <div className='text-sm text-error'>{errors.note.message}</div>}
                    </div>
                    <Button className='w-full' color='primary'>
                      Gửi đánh giá
                    </Button>
                  </form>
                </>
              )}
              {auth.user.role === UserRoles.candidate && !!props.note && (
                <>
                  <div>Nhà tuyển dụng đã viết: </div>
                  <blockquote className='font-semibold italic text-gray-900'>
                    <svg
                      className='mb-4 h-6 w-6 text-gray-400'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='currentColor'
                      viewBox='0 0 18 14'
                    >
                      <path d='M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z' />
                    </svg>
                    <p>{props.note}</p>
                  </blockquote>
                </>
              )}
            </div>
          </div>
        </div>
        <form method='dialog'>
          <Button className='absolute right-2 top-2' color='ghost' size='sm'>
            Đóng ✕
          </Button>
          <div className='modal-backdrop cursor-default bg-black/20'>
            <button>close</button>
          </div>
        </form>
      </dialog>
    </>
  )
})

ApplicationDetail.displayName = 'ApplicationDetail'
export default ApplicationDetail
