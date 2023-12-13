import jobsApi from '@/api/jobs.api'
import userApi from '@/api/user.api'
import Job from '@/components/Job'
import Loading from '@/components/Loading'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth } from '@/redux/reducers/auth-slice'
import { Job as IJob } from '@/types/jobs.type'
import { emptyResponse } from '@/utils/sample/api.sample'
import { useQuery } from '@tanstack/react-query'

export default function CandidateSavedJobs() {
  const auth = useAppSelector(selectAuth)

  const { data, isLoading } = useQuery({
    queryKey: ['saved-jobs', auth.user.id],
    queryFn: () => userApi.getSavedJobs(auth.user.id),
    enabled: !!auth.user.id,
  })

  const { data: outstandingJobsRes, isLoading: isLoadingOutstandingJobs } = useQuery({
    queryKey: ['jobs', 'outstanding'],
    queryFn: jobsApi.getOutstandingJobs,
    initialData: emptyResponse<IJob[]>([]),
  })

  return (
    <div className='mt-4 w-full px-4 lg:px-0'>
      <div className='flex items-center justify-between'>
        <h2 className='text-h3'>Công việc đã lưu {data?.data ? `(${data.data.length})` : ''}</h2>
        <div></div>
      </div>
      <div className='w-full'>
        {isLoading ? (
          <div className='flex items-center justify-center text-gray-500'>
            Đang tải thông tin đơn ứng cử
            <Loading />
          </div>
        ) : data?.data.length ? (
          <div className='grid grid-cols-1 gap-4 py-4 lg:grid-cols-3'>
            {data.data.map((job) => (
              <Job key={job.id} applications={[]} {...job} />
            ))}
          </div>
        ) : (
          <div className='mt-2 flex flex-col items-center rounded-2xl border bg-white p-8 shadow-sm'>
            <img className='h-48 w-48' src='/images/none-result.webp' />
            Bạn chưa lưu công việc nào
          </div>
        )}
      </div>
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
