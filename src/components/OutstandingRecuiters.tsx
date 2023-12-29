import recruitersApi from '@/api/recruiters.api'
import routes from '@/configs/route.config'
import { faAngleRight, faBuilding } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import Loading from './Loading'
import Recruiter from './Recruiter'

export default function OutstandingRecruiters() {
  const { data, isLoading } = useQuery({
    queryKey: ['recruiters', 'outstanding'],
    queryFn: recruitersApi.getOutstandingRecruiters,
  })

  return (
    <div className='mx-auto max-w-screen-xl'>
      <div className='flex flex-col items-center justify-between gap-2 md:flex-row'>
        <div className='flex items-center gap-3 text-2xl'>
          <FontAwesomeIcon icon={faBuilding} shake className='text-primary' />
          <h3 className='text-h3'>Nhà tuyển dụng nổi bật</h3>
        </div>
        <Link className='flex items-center gap-2 hover:link' to={routes.recruiters}>
          Xem tất cả <FontAwesomeIcon icon={faAngleRight} />
        </Link>
      </div>
      {isLoading ? (
        <Loading content='Đang tải danh sách nhà tuyển dụng nổi bật' />
      ) : data?.data.length ? (
        <div className='grid grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-3'>
          {data?.data.map((recruiter) => <Recruiter key={recruiter.id} {...recruiter} />)}
        </div>
      ) : (
        <p className='text-center text-base'>Hiện tại chưa có nhà tuyển dụng nào phù hợp</p>
      )}
    </div>
  )
}
