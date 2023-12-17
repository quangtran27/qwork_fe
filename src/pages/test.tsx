import candidatesApi from '@/api/candidates.api'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth } from '@/redux/reducers/auth-slice'
import { useQuery } from '@tanstack/react-query'

export default function Test() {
  const auth = useAppSelector(selectAuth)

  const { data } = useQuery({
    queryKey: ['candidates'],
    queryFn: () => candidatesApi.getAll(),
    enabled: !!auth.token,
  })

  console.log('candidate response: ', data)

  return <div className='mx-auto w-full max-w-screen-xl py-12'>page for testing</div>
}
