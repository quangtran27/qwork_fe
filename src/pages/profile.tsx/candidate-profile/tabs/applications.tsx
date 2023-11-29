import jobsApi from '@/api/jobs.api'
import userApi from '@/api/user.api'
import Application from '@/components/Application'
import Job from '@/components/Job'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth } from '@/redux/reducers/auth-slice'
import { ApplicationDetail, ApplicationStatusEnum } from '@/types/applications.type'
import { Job as IJob } from '@/types/jobs.type'
import { emptyResponse } from '@/utils/sample/api.sample'
import { useQuery } from '@tanstack/react-query'
import { ChangeEventHandler, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const statusOptions = [
  { label: 'Tất cả', value: 0 },
  { label: 'Đã gửi', value: ApplicationStatusEnum.Sent },
  { label: 'Nhà tuyển dụng đã xem', value: ApplicationStatusEnum.Is_Considering },
  { label: 'Đã liên hệ', value: ApplicationStatusEnum.Is_Approved },
  { label: 'Đã bị từ chối', value: ApplicationStatusEnum.Is_Rejected },
]

export default function Applications() {
  const userId = useAppSelector(selectAuth).id
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const status = Number.parseInt(searchParams.get('status') || '0') || statusOptions[0].value

  const {
    data: { data: applications },
    isLoading,
  } = useQuery({
    queryKey: ['user-applications', userId],
    queryFn: () => userApi.getApplications(userId),
    initialData: emptyResponse<ApplicationDetail[]>([]),
    enabled: !!userId,
  })

  const {
    data: { data: jobs },
  } = useQuery({
    queryKey: ['jobs', 'outstanding'],
    queryFn: jobsApi.getOutstandingJobs,
    initialData: emptyResponse<IJob[]>([]),
  })

  useEffect(() => {
    applications.filter((application) => application.status === status)
  }, [applications, status])

  const handleChangeApplicatoinStatus: ChangeEventHandler<HTMLSelectElement> = (e) => {
    searchParams.set('status', e.target.value)
    navigate({ search: searchParams.toString() })
  }

  return (
    <div className='mt-6 w-full px-4 lg:px-0'>
      <div className='flex items-center justify-between'>
        <h2 className='text-h3'>Việc làm đã ứng tuyển</h2>
        <select className='select select-bordered rounded-full' value={status} onChange={handleChangeApplicatoinStatus}>
          {statusOptions.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </select>
      </div>
      {!isLoading && applications.length == 0 && <p className='text-center'>Bạn chưa ứng tuyển công việc nào!</p>}
      <div className='grid grid-cols-1 gap-6 py-6 lg:grid-cols-2'>
        {applications.map((application) => (
          <Application key={application.id} {...application} />
        ))}
      </div>
      <div className='w-full'>
        <h3 className='text-h3'>Có thể bạn cũng quan tâm</h3>
        <div className='grid grid-cols-1 gap-4 py-4 lg:grid-cols-3'>
          {jobs.map((job) => (
            <Job key={job.id} applications={[]} {...job} />
          ))}
        </div>
      </div>
    </div>
  )
}
