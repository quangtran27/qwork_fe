import userApi from '@/api/user.api'
import Loading from '@/components/Loading'
import { useAppDispatch } from '@/hook/useAppDispatch'
import { setProfile } from '@/redux/reducers/profile-slice'
import { ProfileType } from '@/types/profile.type'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import NotFound from '../not-founded'
import CandidateProfile from './candidate-profile'
import RecruiterProfile from './recruiter-profile'

export default function Profile() {
  const { id } = useParams()
  const dispatch = useAppDispatch()

  const { data, isLoading } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => userApi.getProfile(id || ''),
  })

  useEffect(() => {
    if (data?.data) {
      document.title = `${data.data.name} - Trang cá nhân`
      dispatch(setProfile(data.data))
    }
  }, [data, dispatch])

  return (
    <>
      {isLoading ? (
        <div className='mx-auto flex w-full max-w-screen-xl'>
          <div className='flex w-full items-center justify-center py-20'>
            <Loading content='Đang tải thông tin hồ sơ' />
          </div>
        </div>
      ) : data?.data ? (
        data.data.type === ProfileType.candidate ? (
          <CandidateProfile />
        ) : data.data.type === ProfileType.recruiter ? (
          <RecruiterProfile />
        ) : (
          <NotFound />
        )
      ) : (
        <NotFound />
      )}
    </>
  )
}
