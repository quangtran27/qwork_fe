import userApi from '@/api/user.api'
import Container from '@/components/Container'
import { useAppDispatch } from '@/hook/useAppDispatch'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectProfile } from '@/redux/reducers/auth-slice'
import { setProfile } from '@/redux/reducers/profile-slice'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import CandidateProfile from './candidate-profile'
import RecruiterProfile from './recruiter-profile'

export default function Profile() {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const profile = useAppSelector(selectProfile)

  const { isLoading } = useQuery(['profile', id], () => userApi.getProfile(id || ''), {
    onSuccess: (response) => {
      dispatch(setProfile(response.data))
    },
  })

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
