import recruitersApi from '@/api/recruiters.api'
import Container from '@/components/Container'
import Loading from '@/components/Loading'
import Pagination from '@/components/Pagination'
import Recruiter from '@/components/Recruiter'
import SearchBox from '@/components/SearchBox'
import routes from '@/configs/route.config'
import { faBuilding } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function Recruiters() {
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || '1')

  const { data, isLoading, isFetched, refetch } = useQuery({
    queryKey: ['all-recruiters', page],
    queryFn: () => recruitersApi.getAll({ page: page }),
  })

  useEffect(() => {
    document.title = 'QWork - Nhà tuyển dụng'

    isFetched && refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, refetch])

  return (
    <div className='flex flex-col gap-4 pb-4'>
      <SearchBox
        title='Khám phá nhà tuyển dụng nổi bật trên QWork'
        body={
          <p className='text-center'>
            Các công ty doanh nghiệp đang tuyển dụng, hàng nghìn công việc được đăng mới mỗi ngày!
          </p>
        }
        placeholder='Nhập tên công ty...'
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
            {isLoading ? (
              <Loading content='Đang tải danh sách nhà tuyển dụng' />
            ) : data?.data.length ? (
              <div className='grid grid-cols-1 gap-4 py-4 lg:grid-cols-3'>
                {data.data.map((recruiter) => (
                  <Recruiter key={recruiter.id} {...recruiter} />
                ))}
              </div>
            ) : (
              <div className='mt-2 flex flex-col items-center rounded-2xl border bg-white p-8 shadow-sm'>
                <img className='h-48 w-48' src='/images/none-result.webp' />
                Rất tiếc, không có nhà tuyển dụng phù hợp với yêu cầu của bạn!
              </div>
            )}
          </div>
        </div>
        {data?.pagination && (
          <div className='mb-2 '>
            <Pagination {...data.pagination} />
          </div>
        )}
      </Container>
    </div>
  )
}
