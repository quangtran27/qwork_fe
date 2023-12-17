import jobsApi from '@/api/jobs.api'
import userApi from '@/api/user.api'
import ApplyJob from '@/components/ApplyJob'
import Breadcrumbs from '@/components/Breadcrums'
import Button from '@/components/Button'
import Container from '@/components/Container'
import Job from '@/components/Job'
import JobDescription from '@/components/JobDescription'
import JobInfo from '@/components/JobInfo'
import Loading from '@/components/Loading'
import routes from '@/configs/route.config'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth } from '@/redux/reducers/auth-slice'
import { faPenNib, faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation, useQueries } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import NotFound from './not-founded'

export default function JobDetail() {
  const { id } = useParams()
  const applyJobRef = useRef<HTMLDialogElement>(null)
  const auth = useAppSelector(selectAuth)
  const navigate = useNavigate()
  const [isJobApplied, setJobApplied] = useState(false)
  const [isJobSaved, setJobSaved] = useState(false)

  const [
    { data, isLoading, isError },
    { data: relatedJobsRes, isLoading: isLoadingRelatedJobs },
    { data: saveJobRes },
    { data: applicationsRes },
    { data: CVsRes, refetch: refetchCVs },
  ] = useQueries({
    queries: [
      {
        queryKey: ['job', id],
        queryFn: () => jobsApi.get(id!),
        enabled: !!id,
      },
      {
        queryKey: ['outstanding-jobs'],
        queryFn: jobsApi.getOutstandingJobs,
      },
      {
        queryKey: ['saved-jobs'],
        queryFn: () => userApi.getSavedJobs(auth.user.id),
        enabled: !!auth.user.id,
      },
      {
        queryKey: [],
        queryFn: () => userApi.getApplications(auth.user.id),
        enabled: !!auth.user.id,
      },
      {
        queryKey: ['cvs', auth.user.id],
        queryFn: () => userApi.getCVs(auth.user.id),
        enabled: false,
      },
    ],
  })

  const saveJobMutation = useMutation({
    mutationFn: (action: 'add' | 'remove') => userApi.saveJob(auth.user.id, data?.data.id || '', action),
  })

  const handleApplyJob = async () => {
    await refetchCVs()
    if (auth.token) {
      applyJobRef.current?.showModal()
    } else {
      navigate({
        pathname: routes.login,
        search: `?next=${window.location.pathname}`,
      })
    }
  }

  const handleSaveJob = (action: 'add' | 'remove') => {
    if (auth.token) {
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
    } else {
      navigate({
        pathname: routes.login,
        search: `?next=${window.location.pathname}`,
      })
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (data?.data && applicationsRes?.data.length) {
      setJobApplied(applicationsRes.data.some((application) => application.jobId === data.data.id))
    }
  }, [data, applicationsRes])

  useEffect(() => {
    if (data?.data && saveJobRes?.data.length) {
      setJobSaved(saveJobRes.data.some((savedJob) => data.data.id === savedJob.id))
    }
  }, [data, saveJobRes])

  useEffect(() => {
    if (data) {
      document.title = `Tuyển dụng ${data.data.name}`
    }
  }, [data])

  if (isError) return <NotFound />

  return (
    <div className='px-4 py-4 lg:px-0'>
      <Container>
        {isLoading ? (
          <div className='-mt-header flex h-screen items-center'>
            <Loading content='Đang tải thông tin hồ sơ' />
          </div>
        ) : data?.data ? (
          <>
            <div className='mb-4 w-full'>
              <Breadcrumbs
                items={[
                  { label: 'Việc làm', to: routes.jobs },
                  { label: data.data.name, to: '' },
                ]}
              />
            </div>
            <div className='col-span-2 flex w-full flex-col gap-6'>
              <JobInfo
                {...data.data}
                isApplied={isJobApplied}
                isUpdating={saveJobMutation.isPending}
                isSaved={isJobSaved}
                handleApply={handleApplyJob}
                handleUpdate={handleSaveJob}
              />
              <JobDescription {...data.data} />
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
          </>
        ) : (
          <NotFound />
        )}
        <div className='mt-4'>
          <h3 className='text-h3'>Có thể bạn sẽ quan tâm</h3>
          {isLoadingRelatedJobs ? (
            <div className='flex items-center justify-center'>
              Đang tải công việc nổi bật <Loading />
            </div>
          ) : (
            relatedJobsRes?.data.length && (
              <>
                <div className='grid w-full grid-cols-1 gap-4 py-4 lg:grid-cols-3'>
                  {relatedJobsRes.data.map((job) => (
                    <Job key={job.id} {...job} />
                  ))}
                </div>
              </>
            )
          )}
        </div>
        {data?.data && (
          <ApplyJob
            {...data?.data}
            ref={applyJobRef}
            CVs={CVsRes?.data ? CVsRes.data : []}
            setJobApplied={setJobApplied}
          />
        )}
      </Container>
    </div>
  )
}
