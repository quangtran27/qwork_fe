import jobsApi from '@/api/jobs.api'
import ApplyJob from '@/components/ApplyJob'
import Breadcrumbs, { BreadcrumbItem } from '@/components/Breadcrums'
import Container from '@/components/Container'
import Job from '@/components/Job'
import JobDescription from '@/components/JobDescription'
import JobInfo from '@/components/JobInfo'
import routes from '@/configs/route.config'
import { emptyJob } from '@/constants/jobs.constant'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth } from '@/redux/reducers/auth-slice'
import { ApiResponse } from '@/types/api.type'
import { Job as IJob } from '@/types/jobs.type'
import { AxiosError } from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function JobDetail() {
  const auth = useAppSelector(selectAuth)
  const navigate = useNavigate()
  const applyJobRef = useRef<HTMLDialogElement>(null)
  const { id } = useParams()
  const [job, setJob] = useState(emptyJob)
  const [relatedJobs, setRelatedJobs] = useState<IJob[]>([])
  const { isLoading } = useQuery(['job', id], () => jobsApi.get(id || ''), {
    onSuccess: (response) => {
      setJob(response.data)
    },
    onError: (_err) => {
      const response = (_err as AxiosError).response?.data as ApiResponse<undefined>
      toast.error(response.message)
    },
  })

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Việc làm', to: routes.jobs },
    { label: job.name, to: '' },
  ]

  useQuery({
    queryKey: ['outstanding-jobs'],
    queryFn: jobsApi.getOutstandingJobs,
    onSuccess: (response) => {
      setRelatedJobs(() =>
        response.data.map((job) => {
          return { aplications: [], ...job }
        }),
      )
    },
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleApplyJob = () => {
    if (auth.id) {
      applyJobRef.current?.showModal()
    } else {
      navigate({
        pathname: routes.login,
        search: `?next=${window.location.pathname}`,
      })
    }
  }

  return (
    <div className='mt-header px-4 py-4 lg:px-0'>
      <Container>
        <div className='mb-4 w-full'>
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <div className='col-span-2 flex w-full flex-col gap-6'>
          <JobInfo {...job} handleApply={handleApplyJob} />
          <JobDescription {...job} />
          {/* <Hashtags tags={job.tags.split(',')} /> */}
        </div>
        <div className='divider'></div>
        <div className='w-full'>
          <h3 className='text-h3'>Có thể bạn cũng quan tâm</h3>
          <div className='grid grid-cols-1 gap-4 py-4 lg:grid-cols-3'>
            {relatedJobs.map((job) => (job.id !== id ? <Job {...job} /> : <></>))}
          </div>
        </div>
        <dialog id='my_modal_1' className='modal bg-black/30' open={isLoading}>
          <span className='loading'></span>
        </dialog>
        <ApplyJob ref={applyJobRef} {...job} />
      </Container>
    </div>
  )
}
