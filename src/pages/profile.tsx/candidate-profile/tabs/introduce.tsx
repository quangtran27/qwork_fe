import CandidateDescription from '@/components/CandidateDescription'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectProfile } from '@/redux/reducers/auth-slice'

export default function Introduce() {
  const profile = useAppSelector(selectProfile)
  return (
    <div className='grid w-full grid-cols-1 gap-4 px-4 py-6 lg:grid-cols-2 lg:gap-6 lg:px-0'>
      <div className='rounded-3xl bg-white p-4 shadow'>
        <h3 className='text-h3 text-center lg:text-left'>Giới thiệu</h3>
        <p className='text-center text-lg lg:text-left lg:text-base'>{profile.description}</p>
      </div>
      <CandidateDescription />
    </div>
  )
}
