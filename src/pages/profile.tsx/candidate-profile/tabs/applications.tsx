import jobsApi from '@/api/jobs.api'
import userApi from '@/api/user.api'
import Application from '@/components/Application'
import Job from '@/components/Job'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectProfile } from '@/redux/reducers/auth-slice'
import { ApplicationDetail, ApplicationStatusEnum } from '@/types/applications.type'
import { Job as IJob } from '@/types/jobs.type'
import { ChangeEventHandler, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'

const applicationStatusChoices = [
  { label: 'Tất cả', value: 0 },
  { label: 'Đã gửi', value: ApplicationStatusEnum.Sent },
  { label: 'Nhà tuyển dụng đã xem', value: ApplicationStatusEnum.Is_Considering },
  { label: 'Đã liên hệ', value: ApplicationStatusEnum.Is_Approved },
  { label: 'Đã bị từ chối', value: ApplicationStatusEnum.Is_Rejected },
]

export default function Applications() {
  const profile = useAppSelector(selectProfile)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [applications, setApplications] = useState<ApplicationDetail[]>([])
  const [jobs, setJobs] = useState<IJob[]>([])

  const selectedApplicationStatus =
    Number.parseInt(searchParams.get('status') || '0') || applicationStatusChoices[0].value

  const { isLoading } = useQuery({
    queryKey: ['profile-applications', profile.userId],
    queryFn: () => userApi.getApplications(profile.userId),
    onSuccess: (response) => {
      setApplications(response.data)
    },
  })

  useQuery({
    queryKey: ['outstanding-jobs'],
    queryFn: jobsApi.getOutstandingJobs,
    onSuccess: (response) => {
      setJobs(() =>
        response.data.map((job) => {
          return { aplications: [], ...job }
        }),
      )
    },
  })

  useEffect(() => {
    applications.filter((application) => application.status === selectedApplicationStatus)
  }, [applications, selectedApplicationStatus])

  const handleChangeApplicatoinStatus: ChangeEventHandler<HTMLSelectElement> = (e) => {
    searchParams.set('status', e.target.value)
    navigate({ search: searchParams.toString() })
  }

  return (
    <div className='mt-6 w-full px-4 lg:px-0'>
      <div className='flex items-center justify-between'>
        <h2 className='text-h3'>Công việc đã ứng tuyển</h2>
        <select
          className='select select-bordered rounded-full'
          value={selectedApplicationStatus}
          onChange={handleChangeApplicatoinStatus}
        >
          {applicationStatusChoices.map((choice) => (
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
            <Job key={job.id} {...job} />
          ))}
        </div>
      </div>
    </div>
  )
}
