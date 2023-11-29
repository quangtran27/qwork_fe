import routes from '@/configs/route.config'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth } from '@/redux/reducers/auth-slice'
import { Job } from '@/types/jobs.type'
import { UserRoles } from '@/types/users.type'
import { countExpired } from '@/utils/functions/job.function'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import {
  faBuilding,
  faCircleDollarToSlot,
  faClock,
  faLocationDot,
  faPenNib,
  faRotateRight,
  faHeart as fasHeart,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import Button from './Button'

type JobInfoProps = Job & {
  isSaved?: boolean
  isApplied?: boolean
  handleApply?: () => void
  handleUpdate?: (action: 'add' | 'remove') => void
}

export default function JobInfo({ ...props }: JobInfoProps) {
  const auth = useAppSelector(selectAuth)
  const [dateDisplay, dateClass] = countExpired(props.expired)

  return (
    <div className='flex flex-col items-center gap-6 rounded-2xl border bg-white p-4 shadow-sm lg:flex-row lg:items-start'>
      <figure className='relative h-36 w-36 overflow-hidden rounded-full border shadow'>
        <img
          className='absolute h-full w-full object-contain'
          src={props.recruiterAvatar || '/images/default.png'}
          alt=''
        />
      </figure>
      <div className='flex flex-1 flex-col items-center gap-3 lg:items-start lg:gap-2'>
        <h1 className='text-center text-2xl font-semibold uppercase lg:text-left'>{props.name}</h1>
        <Link
          to={routes.profile.replace(':id', props.userId)}
          className='flex items-center gap-2 text-lg text-gray-600'
        >
          <FontAwesomeIcon icon={faBuilding} />
          {props.recruiterName}
        </Link>
        <div className='flex items-center gap-2 text-base'>
          <FontAwesomeIcon icon={faLocationDot} />
          Địa điểm làm việc: {props.cityName}
        </div>
        {props.salaryFrom !== 0 && props.salaryTo !== 0 && (
          <div className='flex items-center gap-2 text-xl font-semibold text-secondary'>
            <FontAwesomeIcon icon={faCircleDollarToSlot} />
            <span>
              {props.salaryFrom} - {props.salaryTo} triệu
            </span>
          </div>
        )}
        <div className='flex items-center gap-2 text-gray-600'>
          <FontAwesomeIcon icon={faClock} />
          <span>Lần cuối cập nhật: {props.updated}</span>
        </div>
        <div className='flex w-full flex-col items-center justify-between gap-4 lg:flex-row'>
          <div className='cursor-default rounded-full bg-gray-100 px-3 py-1 shadow'>
            <span className={dateClass}>{dateDisplay}</span>
          </div>
          {[UserRoles.candidate, UserRoles.guest].includes(auth.role) && (
            <div className='flex w-full flex-col gap-4 lg:w-fit lg:flex-row'>
              <Button
                variant='outline'
                color='secondary'
                onClick={() => {
                  props.handleUpdate && props.handleUpdate(props.isSaved ? 'remove' : 'add')
                }}
              >
                {props.isSaved ? (
                  <>
                    <FontAwesomeIcon icon={fasHeart} />
                    Đã lưu
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faHeart} />
                    Lưu tin
                  </>
                )}
              </Button>
              <Button
                className='w-full lg:w-fit'
                variant='outline'
                color='primary'
                onClick={() => {
                  props.handleApply && props.handleApply()
                }}
              >
                {props.isApplied ? (
                  <>
                    <FontAwesomeIcon icon={faRotateRight} />
                    Ứng tuyển lại
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPenNib} />
                    Ứng tuyển ngay
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
