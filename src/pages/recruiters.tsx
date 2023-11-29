import recruitersApi from '@/api/recruiters.api'
import Container from '@/components/Container'
import Pagination from '@/components/Pagination'
import Recruiter from '@/components/Recruiter'
import SearchBox from '@/components/SearchBox'
import routes from '@/configs/route.config'
import { Profile } from '@/types/profile.type'
import { emptyResponse } from '@/utils/sample/api.sample'
import { faBuilding } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function Recruiters() {
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || '1')

  const {
    data: { data: recruiters, pagination },
    isFetched,
    refetch,
  } = useQuery({
    queryKey: ['all-recruiters', page],
    queryFn: () => recruitersApi.getAll({ page: page }),
    initialData: emptyResponse<Profile[]>([]),
  })

  useEffect(() => {
    isFetched && refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, refetch])

  return (
    <div className='mt-header flex flex-col gap-4 pb-4'>
      <SearchBox
        title='Khám phá nhà tuyển dụng nổi bật trên QWork'
        body={
          <p className='text-center'>
            Các công ty doanh nghiệp đang tuyển dụng, hàng nghìn công việc được đăng mới mỗi ngày!
          </p>
        }
        placeholder='Nhập tên công ty'
        searchPath={routes.searchRecruiters}
      />

      <Container>
        <div className='w-full'>
          <div className='mt-8 px-4 lg:px-0'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <FontAwesomeIcon icon={faBuilding} className='text-xl text-primary' />
                <h3 className='text-h3'>Tất cả nhà tuyển dụng</h3>
              </div>
            </div>
            {!recruiters.length && <p className='text-center text-base'>Hiện tại chưa có nhà tuyển dụng nào phù hợp</p>}
            <div className='grid grid-cols-1 gap-6 py-6 lg:grid-cols-3'>
              {recruiters.map((recruiter) => (
                <Recruiter key={recruiter.id} {...recruiter} />
              ))}
            </div>
          </div>
        </div>
      </Container>

      <Container>
        <Pagination {...pagination} />
      </Container>
    </div>
  )
}
