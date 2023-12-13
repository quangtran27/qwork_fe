import jobsApi from '@/api/jobs.api'
import userApi from '@/api/user.api'
import Application from '@/components/Application'
import Job from '@/components/Job'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth } from '@/redux/reducers/auth-slice'
import { ApplicationStatusEnum } from '@/types/applications.type'
import { useQuery } from '@tanstack/react-query'
import { ChangeEventHandler, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Loading from './Loading'

const statusOptions = [
  { label: 'Tất cả', value: 0 },
  { label: 'Đã gửi', value: ApplicationStatusEnum.Sent },
  { label: 'Nhà tuyển dụng đã xem', value: ApplicationStatusEnum.Is_Considering },
  { label: 'Đã liên hệ', value: ApplicationStatusEnum.Is_Approved },
  { label: 'Đã bị từ chối', value: ApplicationStatusEnum.Is_Rejected },
]

export default function CandidateApplications() {
  const auth = useAppSelector(selectAuth)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const status = Number.parseInt(searchParams.get('status') || '0') || statusOptions[0].value

  const { data, isLoading } = useQuery({
    queryKey: ['user-applications', auth.user.id],
    queryFn: () => userApi.getApplications(auth.user.id),
    enabled: !!auth.user.id,
  })

  const { data: outstandingJobsRes, isLoading: isLoadingOutstandingJobs } = useQuery({
    queryKey: ['jobs', 'outstanding'],
    queryFn: jobsApi.getOutstandingJobs,
  })

  useEffect(() => {
    if (data?.data) {
      data.data.filter((application) => application.status === status)
    }
  }, [data, status])

  const handleChangeApplicatoinStatus: ChangeEventHandler<HTMLSelectElement> = (e) => {
    searchParams.set('status', e.target.value)
    navigate({ search: searchParams.toString() })
  }

  return (
    <div className='mt-4 w-full px-4 lg:px-0'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-h3'>Việc làm đã ứng tuyển {data?.data ? `(${data.data.length})` : ''}</h2>
        <select className='select select-bordered rounded-full' value={status} onChange={handleChangeApplicatoinStatus}>
          {statusOptions.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center text-gray-500'>
          Đang tải thông tin đơn ứng cử
          <Loading />
        </div>
      ) : data?.data.length ? (
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          {data.data.map((application) => (
            <Application key={application.id} {...application} />
          ))}
        </div>
      ) : (
        <div className='mt-2 flex flex-col items-center rounded-2xl border bg-white p-8 shadow-sm'>
          <img className='h-48 w-48' src='/images/none-result.webp' />
          Rất tiếc, không có đơn ứng tuyển phù hợp
        </div>
      )}
      <div className='mt-6'>
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
    </div>
  )
}
