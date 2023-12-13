import jobsApi from '@/api/jobs.api'
import routes from '@/configs/route.config'
import { faAngleRight, faFire } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import Job from './Job'
import Loading from './Loading'

export default function OutstandingJobs() {
  const { data, isLoading } = useQuery({
    queryKey: ['jobs', 'outstanding'],
    queryFn: jobsApi.getOutstandingJobs,
  })

  return (
    <div className='mx-auto max-w-screen-xl'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <FontAwesomeIcon icon={faFire} bounce className='text-xl text-secondary' />
          <h3 className='text-h3'>Việc làm hot</h3>
        </div>
        <Link className='flex items-center gap-2 hover:link' to={routes.jobs}>
          Xem tất cả <FontAwesomeIcon icon={faAngleRight} />
        </Link>
      </div>
      {isLoading ? (
        <Loading content='Đang tải danh sách việc làm nổi bật' />
      ) : data?.data.length ? (
        <div className='grid grid-cols-1 gap-4 py-4 md:grid-cols-3'>
          {data.data.map((job) => (
            <Job key={job.id} {...job} onEdit={() => {}} onDelete={() => {}} />
          ))}
        </div>
      ) : (
        <p className='text-center text-base'>Hiện tại chưa có việc làm nào phù hợp</p>
      )}
    </div>
  )
}
