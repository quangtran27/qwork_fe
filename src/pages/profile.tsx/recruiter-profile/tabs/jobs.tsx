import addressesApi from '@/api/addresses.api'
import recruitersApi from '@/api/recruiters.api'
import RecruiterDescription from '@/components/RecruiterDecription'
import RecruiterJobs from '@/components/RecruiterJobs'
import { nationwide } from '@/constants/location.constant'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectProfile } from '@/redux/reducers/auth-slice'
import { City } from '@/types/addresses.type'
import { Job } from '@/types/jobs.type'
import { emptyResponse } from '@/utils/sample/api.sample'
import { useQuery } from '@tanstack/react-query'

export default function Jobs() {
  const profile = useAppSelector(selectProfile)

  const {
    data: { data: cities },
  } = useQuery({
    queryKey: ['cities'],
    queryFn: addressesApi.getAllCities,
    initialData: emptyResponse<City[]>([]),
  })

  const {
    data: { data: jobs },
    refetch,
  } = useQuery({
    queryKey: ['recruiter', profile.userId],
    queryFn: () => recruitersApi.getRecruiterJobs(profile.id),
    initialData: emptyResponse<Job[]>([]),
  })

  return (
    <div className='grid w-full grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-7 lg:px-0'>
      <RecruiterDescription {...profile} />
      <div className='lg:col-span-4'>
        <RecruiterJobs cities={[nationwide, ...cities]} jobs={jobs} refetch={refetch} />
      </div>
    </div>
  )
}
