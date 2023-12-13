import routes from '@/configs/route.config'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectProfile } from '@/redux/reducers/auth-slice'
import { ApiResponse } from '@/types/api.type'
import { ApplicationStatusEnum, ApplicationDetail as IApplicationDetail } from '@/types/applications.type'
import { applicationStatusToString } from '@/utils/converters/application.converter'
import { faCheck, faExclamationCircle, faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UseMutationResult } from '@tanstack/react-query'
import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'
import Card from './Card'

type ApplicationDetailProps = IApplicationDetail & {
  useUpdateApplication: UseMutationResult<ApiResponse<IApplicationDetail>, unknown, ApplicationStatusEnum, unknown>
}

const ApplicationDetail = forwardRef<HTMLDialogElement, ApplicationDetailProps>(({ ...props }, ref) => {
  const profile = useAppSelector(selectProfile)
  const [statusContent, statusClass] = applicationStatusToString(props.status)

  const handleUpdateApplication = (to: ApplicationStatusEnum) => {
    props.useUpdateApplication.mutate(to)
  }

  const handleDownloadCV = async () => {
    try {
      const downloadLink = document.createElement('a')
      downloadLink.href = props.cv
      downloadLink.target = '_blank'
      downloadLink.download = `CV ${props.jobName} - ${props.name}.${props.cv.split('.').pop()}` // Replace with the desired file name
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
          {profile.userId === props.recruiterUserId && props.status === ApplicationStatusEnum.Is_Considering && (
            <div className='flex items-center'>
              Đánh giá:
              <div className='ml-2 flex gap-2'>
                <Button
                  size='sm'
                  variant='outline'
                  color='secondary'
                  onClick={() => {
                    handleUpdateApplication(ApplicationStatusEnum.Is_Rejected)
                  }}
                >
                  Hồ sơ chưa phù hợp <FontAwesomeIcon icon={faExclamationCircle} />
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => {
                    handleUpdateApplication(ApplicationStatusEnum.Is_Approved)
                  }}
                >
                  Hồ sơ phù hợp <FontAwesomeIcon icon={faCheck} />
                </Button>
              </div>
            </div>
          )}
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
              <div className='divider'></div>
              <Card>
                <div className='space-y-2'>
                  <div className='space-x-2'>
                    <span className='font-semibold'>Công việc:</span>
                    <Link className='text-primary' to={routes.jobDetail.replace(':id', props.jobId)}>
                      {props.jobName}
                    </Link>
                  </div>
                  <div className='space-x-2'>
                    <span className='font-semibold'>Từ:</span>
                    <Link className='link-hover' to={routes.jobDetail.replace(':id', props.recruiterName)}>
                      {props.recruiterName}
                    </Link>
                  </div>
                </div>
              </Card>
              <div className='divider'></div>
              <Button variant='outline' className='w-full' onClick={handleDownloadCV}>
                Xem CV Gốc <FontAwesomeIcon icon={faEye} />
              </Button>
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
