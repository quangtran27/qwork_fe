import userApi from '@/api/user.api'
import Container from '@/components/Container'
import { emptyProfile } from '@/constants/profile.constant'
import { useAppDispatch } from '@/hook/useAppDispatch'
import { setProfile } from '@/redux/reducers/profile-slice'
import { emptyResponse } from '@/utils/sample/api.sample'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CandidateProfile from './candidate-profile'
import RecruiterProfile from './recruiter-profile'

export default function Profile() {
  const { id } = useParams()
  const dispatch = useAppDispatch()

  const {
    data: { data: profile },
    isLoading,
  } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => userApi.getProfile(id || ''),
    initialData: emptyResponse(emptyProfile),
  })

  useEffect(() => {
    dispatch(setProfile(profile))
  }, [profile, dispatch])

  return (
    <>
      {isLoading && (
        <Container>
          <dialog id='my_modal_1' className='modal bg-black/30' open={true}>
            <span className='loading'></span>
          </dialog>
        </Container>
      )}
      {profile.type === 'guest' && <div>Hồ sơ không tồn tại</div>}
      {profile.type === 'candidate' && <CandidateProfile />}
      {profile.type === 'recruiter' && <RecruiterProfile />}
    </>
  )
}
