import addressesApi from '@/api/addresses.api'
import jobsApi from '@/api/jobs.api'
import Container from '@/components/Container'
import Job from '@/components/Job'
import Loading from '@/components/Loading'
import Pagination from '@/components/Pagination'
import SearchBox from '@/components/SearchBox'
import routes from '@/configs/route.config'
import { nationwide } from '@/constants/location.constant'
import { faBriefcase } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import { ChangeEventHandler, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Jobs() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const page = Number(searchParams.get('page') || '1')
  const city = searchParams.get('city') || '0'

  const { data, isLoading, isFetched, refetch } = useQuery({
    queryKey: ['jobs', page],
    queryFn: () => jobsApi.getAll({ page: page, city: city }),
  })

  const { data: citiesRes } = useQuery({
    queryKey: ['all-cities'],
    queryFn: addressesApi.getAllCities,
  })

  useEffect(() => {
    document.title = 'QWork - Tẩt cả việc làm'

    isFetched && refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, city, refetch])

  const handleSelectCity: ChangeEventHandler<HTMLSelectElement> = (e) => {
    searchParams.set('city', e.target.value)
    navigate({ search: searchParams.toString() })
  }

  return (
    <div className='pb-4'>
      <SearchBox
        title='Tìm việc làm nhanh 24h, việc làm mới nhất và nhanh chóng trên toàn quốc'
        body={<></>}
        placeholder='Tên công việc, vị trí ứng tuyển...'
        searchPath={routes.searchJobs}
        cities={citiesRes?.data ? [nationwide, ...citiesRes.data] : []}
      />
      <Container>
        <div className='w-full'>
          <div className='mt-8 px-4 lg:px-0'>
            <div className='flex flex-col items-center justify-between gap-2 md:flex-row'>
              <div className='flex items-center gap-3'>
                <FontAwesomeIcon icon={faBriefcase} className='text-xl text-secondary' />
                <h3 className='text-h3'>Tất cả công việc</h3>
              </div>
              <select className='select select-bordered rounded-full' value={city} onChange={handleSelectCity}>
                {[nationwide, ...(citiesRes?.data || [])].map((city) => (
                  <option key={city.code} value={city.code}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            {isLoading ? (
              <Loading content='Đang tải danh sách công việc' />
            ) : data?.data.length ? (
              <div className='grid grid-cols-1 gap-4 py-4 lg:grid-cols-3'>
                {data.data.map((job) => (
                  <Job key={job.id} {...job} />
                ))}
              </div>
            ) : (
              <div className='mt-2 flex flex-col items-center rounded-2xl border bg-white p-8 shadow-sm'>
                <img className='h-48 w-48' src='/images/none-result.webp' />
                Rất tiếc, không có công việc phù hợp với yêu cầu của bạn!
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
