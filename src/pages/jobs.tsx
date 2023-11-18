import jobsApi from '@/api/jobs.api'
import Container from '@/components/Container'
import Job from '@/components/Job'
import Pagination from '@/components/Pagination'
import SearchBox from '@/components/SearchBox'
import routes from '@/configs/route.config'
import { emptyPagination } from '@/constants/commons.constant'
import { ApiResponse } from '@/types/api.type'
import { Job as IJob } from '@/types/jobs.type'
import { faBriefcase } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Jobs() {
  const [searchParams] = useSearchParams()
  const [jobs, setJobs] = useState<IJob[]>([])
  const [pagination, setPagingation] = useState(emptyPagination)

  const page = Number(searchParams.get('page') || '1')

  const { refetch } = useQuery({
    queryKey: ['all-jobs', page],
    queryFn: () => jobsApi.getAll({ page: page }),
    onSuccess: (response) => {
      setJobs(response.data)
      setPagingation(response.pagination)
    },
    onError: (_err) => {
      const response = (_err as AxiosError).response?.data as ApiResponse<undefined>
      toast.error(response.message)
    },
  })

  useEffect(() => {
    refetch()
  }, [page, refetch])

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
            <div className='flex items-center gap-3'>
              <FontAwesomeIcon icon={faBriefcase} bounce className='text-xl text-secondary' />
              <h3 className='text-h3'>Tất cả công việc</h3>
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
