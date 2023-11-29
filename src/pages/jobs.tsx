import addressesApi from '@/api/addresses.api'
import jobsApi from '@/api/jobs.api'
import Container from '@/components/Container'
import Job from '@/components/Job'
import Pagination from '@/components/Pagination'
import SearchBox from '@/components/SearchBox'
import routes from '@/configs/route.config'
import { nationwide } from '@/constants/location.constant'
import { City } from '@/types/addresses.type'
import { Job as IJob } from '@/types/jobs.type'
import { emptyResponse } from '@/utils/sample/api.sample'
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

  const {
    data: { data: jobs, pagination },
    isFetched,
    refetch,
  } = useQuery({
    queryKey: ['jobs', page],
    queryFn: () => jobsApi.getAll({ page: page, city: city }),
    initialData: emptyResponse<IJob[]>([]),
  })

  const { data: citiesRes } = useQuery({
    queryKey: ['all-cities'],
    queryFn: addressesApi.getAllCities,
    initialData: emptyResponse<City[]>([]),
  })

  useEffect(() => {
    isFetched && refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, city, refetch])

  const handleSelectCity: ChangeEventHandler<HTMLSelectElement> = (e) => {
    searchParams.set('city', e.target.value)
    navigate({ search: searchParams.toString() })
  }

  return (
    <div className='mt-header pb-4'>
      <SearchBox
        title='Tìm việc làm nhanh 24h, việc làm mới nhất và nhanh chóng trên toàn quốc'
        body={<></>}
        placeholder='Tên công việc, vị trí ứng tuyển'
        searchPath={routes.searchJobs}
      />
      <Container>
        <div className='w-full'>
          <div className='mt-8 px-4 lg:px-0'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <FontAwesomeIcon icon={faBriefcase} className='text-xl text-secondary' />
                <h3 className='text-h3'>Tất cả công việc</h3>
              </div>
              <select className='select select-bordered rounded-full' value={city} onChange={handleSelectCity}>
                <option key={nationwide.code} value={nationwide.code}>
                  {nationwide.name}
                </option>
                {citiesRes.data.map((city) => (
                  <option key={city.code} value={city.code}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            {!jobs.length && <p className='text-center text-base'>Hiện tại chưa có việc làm nào phù hợp</p>}
            <div className='grid grid-cols-1 gap-6 py-6 lg:grid-cols-3'>
              {jobs.map((job) => (
                <Job key={job.id} {...job} />
              ))}
            </div>
          </div>
        </div>
        <div className='mb-2 '>
          <Pagination {...pagination} />
        </div>
      </Container>
    </div>
  )
}
