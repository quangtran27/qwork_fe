import jobsApi from '@/api/jobs.api'
import Container from '@/components/Container'
import Job from '@/components/Job'
import Pagination from '@/components/Pagination'
import SearchBox from '@/components/SearchBox'
import { Job as IJob } from '@/types/jobs.type'
import { emptyResponse } from '@/utils/sample/api.sample'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function SearchJobs() {
  const [searchParams] = useSearchParams()

  const keyword = searchParams.get('keyword') || ''
  const page = searchParams.get('page') || '1'

  const {
    data: { data: jobs, pagination },
    refetch,
  } = useQuery({
    queryKey: ['jobs', keyword, page],
    queryFn: () => jobsApi.getAll({ keyword: keyword, page: page }),
    initialData: emptyResponse<IJob[]>([]),
  })

  useEffect(() => {
    if (keyword || page) {
      refetch()
    }
  }, [keyword, page, refetch])

  return (
    <div className='mt-header'>
      <SearchBox title='Tìm việc làm nhanh 24h, việc làm mới nhất và nhanh chóng trên toàn quốc' />
      <div className='my-4 lg:my-6'>
        <Container>
          <div className='px-4 lg:px-0'>
            <div className='flex w-full items-center justify-between'>
              <div className='flex items-center gap-3'>
                <h2>
                  Có {pagination.total} kết quả tìm kiếm cho công việc:{' '}
                  <span className='text-xl font-semibold text-secondary'>{keyword}</span>
                </h2>
              </div>
            </div>
            {jobs.length === 0 && (
              <p className='text-center text-gray-500'>Không có công việc phù hợp với yêu cầu của bạn!</p>
            )}
            <div className='grid w-full grid-cols-1 gap-6 py-6 lg:grid-cols-3'>
              {jobs.map((job) => (
                <Job key={job.id} {...job} />
              ))}
            </div>
          </div>
          <Pagination {...pagination} />
        </Container>
      </div>
    </div>
  )
}
