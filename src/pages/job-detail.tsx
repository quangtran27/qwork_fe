import jobsApi from '@/api/jobs.api'
import userApi from '@/api/user.api'
import ApplyJob from '@/components/ApplyJob'
import Breadcrumbs, { BreadcrumbItem } from '@/components/Breadcrums'
import Button from '@/components/Button'
import Container from '@/components/Container'
import Job from '@/components/Job'
import JobDescription from '@/components/JobDescription'
import JobInfo from '@/components/JobInfo'
import routes from '@/configs/route.config'
import { emptyJob } from '@/constants/jobs.constant'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth } from '@/redux/reducers/auth-slice'
import { ApplicationDetail } from '@/types/applications.type'
import { Job as IJob } from '@/types/jobs.type'
import { emptyResponse } from '@/utils/sample/api.sample'
import { faPenNib, faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function JobDetail() {
  const { id } = useParams()
  const userId = useAppSelector(selectAuth).id
  const applyJobRef = useRef<HTMLDialogElement>(null)
  const navigate = useNavigate()
  const [isJobApplied, setJobApplied] = useState(false)
  const [isJobSaved, setJobSaved] = useState(false)

  const {
    data: { data: job },
    isLoading,
  } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsApi.get(id || ''),
    initialData: emptyResponse<IJob>(emptyJob),
  })

  const { data: relatedJobsRes } = useQuery({
    queryKey: ['outstanding-jobs'],
    queryFn: jobsApi.getOutstandingJobs,
    initialData: emptyResponse<IJob[]>([]),
  })

  const {
    data: { data: savedJobs },
  } = useQuery({
    queryKey: ['saved-jobs'],
    queryFn: () => userApi.getSavedJobs(userId),
    initialData: emptyResponse<IJob[]>([]),
    enabled: !!userId,
  })

  const {
    data: { data: applications },
  } = useQuery({
    queryKey: [],
    queryFn: () => userApi.getApplications(userId),
    initialData: emptyResponse<ApplicationDetail[]>([]),
    enabled: !!userId,
  })

  const saveJobMutation = useMutation({
    mutationFn: (action: 'add' | 'remove') => userApi.saveJob(userId, job.id, action),
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (applications.length) {
      setJobApplied(applications.some((application) => application.jobId === job.id))
    }
  }, [job.id, applications])

  useEffect(() => {
    if (savedJobs.length) {
      setJobSaved(savedJobs.some((savedJob) => job.id === savedJob.id))
    }
  }, [job.id, savedJobs])

  const handleApplyJob = () => {
    if (userId) {
      applyJobRef.current?.showModal()
    } else {
      navigate({
        pathname: routes.login,
        search: `?next=${window.location.pathname}`,
      })
    }
  }

  const handleSaveJob = (action: 'add' | 'remove') => {
    !saveJobMutation.isPending &&
      saveJobMutation.mutate(action, {
        onSuccess: (res) => {
          toast.success(res.message)
          setJobSaved(action === 'add')
        },
        onError: () => {
          toast.error('Đã xảy ra lỗi, xin thử lại')
        },
      })
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Việc làm', to: routes.jobs },
    { label: job.name, to: '' },
  ]

  return (
    <div className='mt-header px-4 py-4 lg:px-0'>
      <Container>
        <div className='mb-4 w-full'>
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <div className='col-span-2 flex w-full flex-col gap-6'>
          <JobInfo
            {...job}
            isApplied={isJobApplied}
            isSaved={isJobSaved}
            handleApply={handleApplyJob}
            handleUpdate={handleSaveJob}
          />
          <JobDescription {...job} />
          {/* <Hashtags tags={job.tags.split(',')} /> */}
        </div>
        <div className='divider my-8'>
          <Button className='w-full lg:w-fit' variant='contain' color='primary' onClick={handleApplyJob}>
            {isJobApplied ? (
              <>
                <FontAwesomeIcon icon={faRotateRight} />
                Ứng tuyển lại
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPenNib} />
                Ứng tuyển ngay
              </>
            )}
          </Button>
        </div>
        <div className='w-full'>
          <h3 className='text-h3'>Có thể bạn cũng quan tâm</h3>
          <div className='grid grid-cols-1 gap-4 py-4 lg:grid-cols-3'>
            {relatedJobsRes.data
              .filter((job) => job.id !== id)
              .map((job) => (
                <Job key={job.id} {...job} />
              ))}
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
