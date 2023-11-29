import userApi from '@/api/user.api'
import Application from '@/components/Application'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectProfile } from '@/redux/reducers/auth-slice'
import { ApplicationDetail } from '@/types/applications.type'
import { emptyResponse } from '@/utils/sample/api.sample'
import { useQuery } from '@tanstack/react-query'

export default function Applications() {
  const profile = useAppSelector(selectProfile)

  const {
    data: { data: applications },
  } = useQuery({
    queryKey: ['profile-applications', profile.userId],
    queryFn: () => userApi.getApplications(profile.userId),
    initialData: emptyResponse<ApplicationDetail[]>([]),
  })

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between'>
        <h2 className='text-h3'>Công việc đã ứng tuyển</h2>
        <select className='select select-bordered rounded-full'>
          <option>Đã gửi</option>
          <option>Đang xem xét</option>
          <option>Đã liên hệ</option>
          <option>Đã bị từ chối</option>
        </select>
      </div>
      <div className='mt-4 grid grid-cols-2  gap-6 py-6'>
        {applications.map((application) => (
          <Application key={application.id} {...application} />
        ))}
      </div>
      <div className='h-screen'></div>
    </div>
  )
}
