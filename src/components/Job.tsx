import routes from '@/configs/route.config'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth, selectProfile } from '@/redux/reducers/auth-slice'
import { Job as IJob } from '@/types/jobs.type'
import { ProfileType } from '@/types/profile.type'
import { countExpired } from '@/utils/functions/job.function'
import { handleImageError } from '@/utils/handlers/error-image.handler'
import { faLocation, faNewspaper, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Application from './Application'
import Button from './Button'
import TooltipText from './TooltipText'

type JobProps = IJob & {
  showApplications?: boolean
  showController?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export default function Job({
  id,
  userId,
  name,
  recruiterName,
  recruiterAvatar,
  recruiterId,
  salaryFrom: minSalary,
  salaryTo: maxSalary,
  updated,
  expired,
  cityName,
  status: _status,
  showApplications = false,
  showController = false,
  applications,
  onEdit,
  onDelete,
}: JobProps) {
  const profile = useAppSelector(selectProfile)
  const auth = useAppSelector(selectAuth)
  const [dateDisplay, dateClass] = countExpired(expired)
  const [status] = useState(_status)

  return (
    <Link
      to={routes.jobDetail.replace(':id', id)}
      className='flex cursor-pointer flex-col rounded-2xl border bg-white p-4 shadow-sm transition-all'
    >
      <div className='flex flex-1'>
        <figure className='relative h-14 w-14 overflow-hidden rounded-full border bg-white shadow-sm'>
          <img
            className='absolute h-full w-full object-contain'
            src={recruiterAvatar}
            alt={name}
            onError={handleImageError}
          />
        </figure>
        <div className='flex flex-1 flex-col gap-1 pl-4'>
          <div className='flex items-center'>
            <TooltipText className='pr-10 text-lg font-semibold' content={name} description={name} ellipsis />
            {showController &&
              profile.type === ProfileType.recruiter &&
              profile.userId === auth.id &&
              (status ? (
                <span className='badge badge-info whitespace-nowrap'>Đang tuyển dụng</span>
              ) : (
                <span className='badge badge-ghost whitespace-nowrap'>Ngưng tuyển</span>
              ))}
          </div>
          <Link to={routes.profile.replace(':id', recruiterId)} className='link-hover text-gray-600'>
            <TooltipText content={recruiterName || ''} description={recruiterName || ''} ellipsis />
          </Link>
          <span className='text-lg font-semibold text-secondary'>
            {minSalary === 0 || maxSalary === 0 ? 'Thoả thuận' : `${minSalary} - ${maxSalary} triệu`}
          </span>
          <span className={`${dateClass} text-base`}>{dateDisplay}</span>
          <div className='flex items-center gap-2 text-gray-600'>
            <FontAwesomeIcon icon={faLocation} />
            <span>{cityName}</span>
          </div>
        </div>
      </div>
      {showController && profile.type === ProfileType.recruiter && userId === auth.id && (
        <>
          <div className='divider'></div>
          <div className='flex flex-col items-center justify-between gap-3 lg:flex-row'>
            <div>Cập nhật lần cuối: {updated}</div>
            <div className='flex justify-end gap-3'>
              <Link to={showApplications ? '' : `?${new URLSearchParams({ show: id })}`} className='indicator mr-2'>
                <span className='badge indicator-item badge-secondary'>{applications?.length}</span>
                <Button size='sm' variant={showApplications ? 'contain' : 'outline'}>
                  <FontAwesomeIcon icon={faNewspaper} /> Đơn ứng tuyển
                </Button>
              </Link>
              <Button color='warning' variant='outline' size='sm' onClick={onEdit}>
                <FontAwesomeIcon icon={faPenToSquare} />
              </Button>
              <Button color='error' variant='outline' size='sm' onClick={onDelete}>
                <FontAwesomeIcon icon={faTrashCan} />
              </Button>
            </div>
          </div>
          {showApplications && (
            <>
              <div className='divider'></div>
              <div className='flex flex-col gap-4'>
                {!applications?.length && (
                  <div className='text-center text-gray-400'>Chưa có đơn úng tuyển nào cho công việc này!</div>
                )}
                {applications?.map((application) => <Application key={application.id} {...application} />)}
              </div>
            </>
          )}
        </>
      )}
    </Link>
  )
}
