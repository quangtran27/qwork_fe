import applicationsApi from '@/api/applications.api'
import routes from '@/configs/route.config'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth } from '@/redux/reducers/auth-slice'
import { ApplicationStatusEnum, ApplicationDetail as IApplicationDetail } from '@/types/applications.type'
import { UserRoles } from '@/types/users.type'
import { applicationStatusToString } from '@/utils/converters/application.converter'
import { handleImageError } from '@/utils/handlers/error-image.handler'
import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApplicationDetail from './ApplicationDetail'
import Card from './Card'
import TooltipText from './TooltipText'

type ApplicationProps = IApplicationDetail

export default function Application({ ...props }: ApplicationProps) {
  const auth = useAppSelector(selectAuth)
  const [status, setStatus] = useState<ApplicationStatusEnum>(props.status)
  const [statusContent, statusClass] = applicationStatusToString(status)
  const detailRef = useRef<HTMLDialogElement>(null)

  const useUpdateApplication = useMutation({
    mutationFn: (status: ApplicationStatusEnum) => applicationsApi.updateApplicationStatus(props.id, status),
    onSuccess: (response) => {
      setStatus(response.data.status)
    },
    onError: () => {
      toast.error('Đã xảy ra lỗi, vui lòng thử lại')
    },
  })

  const handleReviewApplication = async () => {
    if (status === ApplicationStatusEnum.Sent)
      useUpdateApplication.mutate(ApplicationStatusEnum.Is_Considering, {
        onSuccess: (response) => {
          setStatus(response.data.status)
        },
      })

    detailRef.current?.show()
  }

  return (
    <>
      {auth.user.role == UserRoles.recruiter ? (
        <div className='relative ml-1 flex gap-2'>
          <Link to={routes.profile.replace(':id', props.candidateUserId)} className='p-2'>
            <figure className='h-10 w-10 overflow-hidden rounded-full'>
              <img src={props.candidateAvatar} onError={handleImageError} />
            </figure>
          </Link>
          <div className='flex flex-1 flex-col gap-1 rounded-2xl bg-gray-100 px-3 py-2'>
            <Link to={routes.profile.replace(':id', props.candidateUserId)} className='text-h4'>
              {props.name}
            </Link>
            <div>Ứng tuyển vào {props.created}</div>
            <div>
              <span className='text-gray-600'>CV Đã ứng tuyển:</span>{' '}
              <Link className='link-primary link' to={props.cv}>
                Tải về
              </Link>
            </div>
            <div className='divider my-0'></div>
            <div className='flex justify-between text-sm'>
              <div>
                Trạng thái: <span className={`${statusClass} badge font-semibold`}>{statusContent}</span>
              </div>
              <div>Cập nhật: {props.updated}</div>
            </div>
            <button
              className='link-hover link-primary absolute right-0 top-0 m-2 cursor-pointer'
              onClick={handleReviewApplication}
            >
              Chi tiết {'>'}
            </button>
          </div>
        </div>
      ) : (
        <Card>
          <div className='flex gap-5'>
            <Link to={routes.jobDetail.replace(':id', props.jobId)}>
              <figure className='relative h-12 w-12 overflow-hidden rounded-full border'>
                <img
                  className='absolute h-full w-full object-cover'
                  src={props.recruiterAvatar}
                  alt={props.recruiterName}
                  onError={handleImageError}
                />
              </figure>
            </Link>
            <div className='flex flex-1 flex-col gap-2'>
              <Link to={routes.jobDetail.replace(':id', props.jobId)} className='flex items-center justify-between'>
                <TooltipText
                  className='text-lg font-semibold hover:text-primary'
                  content={props.jobName}
                  description={props.jobName}
                  ellipsis
                />{' '}
                <span className='whitespace-nowrap text-base font-bold text-secondary'>
                  {props.jobSalaryFrom === 0 || props.jobSalaryTo === 0
                    ? 'Thoả thuận'
                    : `${props.jobSalaryFrom} - ${props.jobSalaryTo} triệu`}
                </span>
              </Link>
              <Link className='link-hover text-gray-500' to={routes.profile.replace(':id', props.recruiterUserId)}>
                <TooltipText content={props.recruiterName} description={props.recruiterName} ellipsis />
              </Link>
              <div className='flex items-center justify-between'>
                <div>Ứng tuyển vào: {props.created}</div>
                <button className='link-hover link-primary cursor-pointer' onClick={handleReviewApplication}>
                  Chi tiết {'>'}
                </button>
              </div>
              <div className='divider my-0'></div>
              <div className='flex items-center justify-between text-sm'>
                <div>
                  Trạng thái: <span className={`${statusClass} p-3`}>{statusContent}</span>
                </div>
                <div>Cập nhật: {props.updated}</div>
              </div>
            </div>
          </div>
        </Card>
      )}
      <ApplicationDetail {...props} status={status} useUpdateApplication={useUpdateApplication} ref={detailRef} />
    </>
  )
}
