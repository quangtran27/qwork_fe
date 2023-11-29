import jobsApi from '@/api/jobs.api'
import userApi from '@/api/user.api'
import Job from '@/components/Job'
import Loading from '@/components/Loading'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth } from '@/redux/reducers/auth-slice'
import { Job as IJob } from '@/types/jobs.type'
import { emptyResponse } from '@/utils/sample/api.sample'
import { useQuery } from '@tanstack/react-query'

export default function SavedJobs() {
  const userId = useAppSelector(selectAuth).id

  const {
    data: { data: jobs },
    isPending: isLoadingJobs,
  } = useQuery({
    queryKey: ['saved-jobs', userId],
    queryFn: () => userApi.getSavedJobs(userId),
    initialData: emptyResponse<IJob[]>([]),
  })

  const {
    data: { data: outstandingJobs },
    isPending: isLoadingOutstandingJobs,
  } = useQuery({
    queryKey: ['jobs', 'outstanding'],
    queryFn: jobsApi.getOutstandingJobs,
    initialData: emptyResponse<IJob[]>([]),
  })

  return (
    <div className='mt-6 w-full px-4 lg:px-0'>
      <div className='flex items-center justify-between'>
        <h2 className='text-h3'>Công việc đã lưu</h2>
        <div></div>
      </div>
      <div className='mb-4 w-full'>
        {isLoadingJobs ? (
          <Loading />
        ) : jobs.length ? (
          <div className='grid grid-cols-1 gap-6 py-6 lg:grid-cols-3'>
            {jobs.map((job) => (
              <Job key={job.id} applications={[]} {...job} />
            ))}
          </div>
        ) : (
          <p className='text-center'>Bạn chưa lưu công việc nào!</p>
        )}
      </div>
      <div className='w-full'>
        <h3 className='text-h3'>Có thể bạn cũng quan tâm</h3>
        {isLoadingOutstandingJobs ? (
          <Loading />
        ) : outstandingJobs.length ? (
          <div className='grid grid-cols-1 gap-4 py-4 lg:grid-cols-3'>
            {outstandingJobs.map((job) => (
              <Job key={job.id} applications={[]} {...job} />
            ))}
          </div>
        ) : (
          <p className='text-center'>Bạn chưa ứng tuyển công việc nào!</p>
        )}
      </div>
    </div>
  )
}
