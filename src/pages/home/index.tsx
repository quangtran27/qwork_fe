import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth } from '@/redux/reducers/auth-slice'
import { UserRoles } from '@/types/users.type'
import CandidateHome from './candidate-home'
import RecruiterHome from './recruiter-home'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    document.title = 'QWork - Trang chủ'
  }, [])

  const auth = useAppSelector(selectAuth)
  return auth.user.role === UserRoles.recruiter ? <RecruiterHome /> : <CandidateHome />
}
