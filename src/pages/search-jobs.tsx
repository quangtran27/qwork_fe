import addressesApi from '@/api/addresses.api'
import jobsApi from '@/api/jobs.api'
import Container from '@/components/Container'
import Job from '@/components/Job'
import Loading from '@/components/Loading'
import Pagination from '@/components/Pagination'
import SearchBox from '@/components/SearchBox'
import routes from '@/configs/route.config'
import { nationwide } from '@/constants/location.constant'
import { useQueries, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function SearchJobs() {
  const [searchParams] = useSearchParams()

  const keyword = searchParams.get('keyword') || ''
  const page = searchParams.get('page') || '1'
  const city = searchParams.get('city') || '0'

  const [{ data, isLoading, isFetched, refetch }, { data: citiesRes }] = useQueries({
    queries: [
      {
        queryKey: ['jobs', keyword, page],
        queryFn: () => jobsApi.getAll({ keyword: keyword, city: city, page: page }),
      },
      {
        queryKey: ['cities'],
        queryFn: addressesApi.getAllCities,
      },
    ],
  })

  const { data: outstandingJobsRes, isLoading: isLoadingOutstandingJobs } = useQuery({
    queryKey: ['jobs', 'outstanding'],
    queryFn: jobsApi.getOutstandingJobs,
    enabled: isFetched && !data?.data.length,
  })

  useEffect(() => {
    if (keyword || page) {
      refetch()
    }
  }, [keyword, city, page, refetch])

  return (
    <>
      <SearchBox
        title='Tìm việc làm nhanh 24h, việc làm mới nhất và nhanh chóng trên toàn quốc'
        searchPath={routes.searchJobs}
        cities={citiesRes?.data ? [nationwide, ...citiesRes.data] : []}
      />
      <div className='my-4 lg:my-6'>
        <Container>
          <div className='w-full px-4 lg:px-0'>
            <div className='flex w-full items-center justify-between'>
              <div className='flex items-center gap-3'>
                <h2>
                  Có {data?.pagination.total || 0} kết quả tìm kiếm cho công việc:{' '}
                  <span className='text-lg font-semibold text-secondary'>{keyword}</span>
                  {!!citiesRes?.data && (
                    <>
                      {' '}
                      {city === '0' ? 'trên' : 'ở'}{' '}
                      <span className='font-semibold text-primary'>
                        {[nationwide, ...citiesRes.data].find((c) => c.code === Number.parseInt(city))?.name}
                      </span>
                    </>
                  )}
                </h2>
              </div>
            </div>
            {isLoading ? (
              <div className='flex items-center justify-center'>
                Đang tìm kiếm kết quả cho công việc: <span className='ml-2 font-medium text-secondary'>{keyword}</span>{' '}
                <Loading />
              </div>
            ) : data?.data.length ? (
              <>
                <div className='grid w-full grid-cols-1 gap-4 py-4 lg:grid-cols-3'>
                  {data.data.map((job) => (
                    <Job key={job.id} {...job} />
                  ))}
                </div>
              </>
            ) : (
              <div className='mt-2 flex flex-col items-center rounded-2xl border bg-white p-8 shadow-sm'>
                <img className='h-48 w-48' src='/images/none-result.webp' />
                Rất tiếc, không có công việc phù hợp với yêu cầu của bạn!
              </div>
            )}
          </div>
          {data?.pagination && <Pagination {...data.pagination} />}
          <div className='mt-8'>
            {isLoadingOutstandingJobs ? (
              <div className='flex items-center'>
                Đang tải công việc nổi bật <Loading />
              </div>
            ) : (
              outstandingJobsRes?.data.length && (
                <>
                  <h3 className='text-h3'>Có thể bạn sẽ quan tâm</h3>
                  <div className='grid w-full grid-cols-1 gap-4 py-4 lg:grid-cols-3'>
                    {outstandingJobsRes.data.map((job) => (
                      <Job key={job.id} {...job} />
                    ))}
                  </div>
                </>
              )
            )}
          </div>
        </Container>
      </div>
    </>
  )
}
