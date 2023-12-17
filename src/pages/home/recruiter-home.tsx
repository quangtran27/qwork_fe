import candidatesApi from '@/api/candidates.api'
import Candidate from '@/components/Candidate'
import Loading from '@/components/Loading'
import SearchBox from '@/components/SearchBox'
import routes from '@/configs/route.config'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth } from '@/redux/reducers/auth-slice'
import { faAngleRight, faPeopleGroup } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

export default function RecruiterHome() {
  const auth = useAppSelector(selectAuth)

  const { data, isLoading } = useQuery({
    queryKey: ['candidates'],
    queryFn: () => candidatesApi.getAll(),
    enabled: !!auth.token,
  })

  return (
    <>
      <SearchBox
        title='Tìm ra các ứng cử viên phù hợp cho công việc của bạn'
        body={<></>}
        placeholder='Tên, vị trí ứng cử viên mà bạn mong muốn...'
        searchPath={routes.searchCandidate}
      />
      <section className='mt-8 px-4 lg:px-0'>
        <div className='mx-auto max-w-screen-xl'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3 text-2xl'>
              <FontAwesomeIcon icon={faPeopleGroup} className='text-secondary' />
              <h3 className='text-h3'>Ứng cử viên nổi bật</h3>
            </div>
            <Link className='flex items-center gap-2 hover:link' to={routes.candidate}>
              Xem tất cả <FontAwesomeIcon icon={faAngleRight} />
            </Link>
          </div>
          {isLoading ? (
            <Loading content='Đang tải danh sách nhà tuyển dụng nổi bật' />
          ) : data?.data.length ? (
            <div className='grid grid-cols-1 gap-4 py-4 md:grid-cols-3'>
              {data?.data.map((candidate) => <Candidate key={candidate.id} {...candidate} />)}
            </div>
          ) : (
            <p className='text-center text-base'>Hiện tại chưa có nhà tuyển dụng nào phù hợp</p>
          )}
        </div>
      </section>
    </>
  )
}
