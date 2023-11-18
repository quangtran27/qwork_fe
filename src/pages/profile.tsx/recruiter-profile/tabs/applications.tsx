import userApi from '@/api/user.api'
import Application from '@/components/Application'
import { useAppSelector } from '@/hook/useAppSelector'
import { ApplicationDetail } from '@/types/applications.type'
import { selectProfile } from '@/redux/reducers/auth-slice'
import { useState } from 'react'
import { useQuery } from 'react-query'

export default function Applications() {
  const profile = useAppSelector(selectProfile)
  const [applications, setApplications] = useState<ApplicationDetail[]>([])

  useQuery({
    queryKey: ['profile-applications', profile.userId],
    queryFn: () => userApi.getApplications(profile.userId),
    onSuccess: (response) => {
      setApplications(response.data)
    },
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
