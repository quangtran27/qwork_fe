import addressesApi from '@/api/addresses.api'
import jobsApi from '@/api/jobs.api'
import Container from '@/components/Container'
import Job from '@/components/Job'
import Pagination from '@/components/Pagination'
import SearchBox from '@/components/SearchBox'
import routes from '@/configs/route.config'
import { emptyPagination } from '@/constants/commons.constant'
import { nationwide } from '@/constants/location.constant'
import { City } from '@/types/addresses.type'
import { ApiResponse } from '@/types/api.type'
import { Job as IJob } from '@/types/jobs.type'
import { faBriefcase } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AxiosError } from 'axios'
import { ChangeEventHandler, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Jobs() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [jobs, setJobs] = useState<IJob[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [filteredJobs, setFilteredJobs] = useState<IJob[]>([])
  const [pagination, setPagingation] = useState(emptyPagination)

  const page = Number(searchParams.get('page') || '1')
  const city = searchParams.get('city') || '0'

  const { refetch } = useQuery({
    queryKey: ['all-jobs', page],
    queryFn: () => jobsApi.getAll({ page: page, city: city }),
    onSuccess: (response) => {
      setJobs(response.data)
      setFilteredJobs(response.data)
      setPagingation(response.pagination)
    },
    onError: (_err) => {
      const response = (_err as AxiosError).response?.data as ApiResponse<undefined>
      toast.error(response.message)
    },
  })

  useQuery({
    queryKey: ['all-cities'],
    queryFn: addressesApi.getAllCities,
    onSuccess: (response) => {
      setCities([nationwide, ...response.data])
    },
  })

  useEffect(() => {
    refetch()
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
                <FontAwesomeIcon icon={faBriefcase} bounce className='text-xl text-secondary' />
                <h3 className='text-h3'>Tất cả công việc</h3>
              </div>
              <select className='select select-bordered rounded-full' value={city} onChange={handleSelectCity}>
                {cities.map((city) => (
                  <option key={city.code} value={city.code}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            {!jobs.length && <p className='text-center text-base'>Hiện tại chưa có việc làm nào phù hợp</p>}
            <div className='grid grid-cols-1 gap-6 py-6 lg:grid-cols-3'>
              {filteredJobs.map((job) => (
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
