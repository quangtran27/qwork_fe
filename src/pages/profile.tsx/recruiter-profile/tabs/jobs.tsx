import addressesApi from '@/api/addresses.api'
import recruitersApi from '@/api/recruiters.api'
import RecruiterDescription from '@/components/RecruiterDecription'
import RecruiterJobs from '@/components/RecruiterJobs'
import { nationwide } from '@/constants/location.constant'
import { useAppSelector } from '@/hook/useAppSelector'
import { City } from '@/types/addresses.type'
import { Job as IJob } from '@/types/jobs.type'
import { selectProfile } from '@/redux/reducers/auth-slice'
import { useState } from 'react'
import { useQuery } from 'react-query'

export default function Jobs() {
  const profile = useAppSelector(selectProfile)
  const [cities, setCities] = useState<City[]>([])
  const [jobs, setJobs] = useState<IJob[]>([])

  useQuery({
    queryKey: ['all-cities'],
    queryFn: addressesApi.getAllCities,
    onSuccess: (response) => {
      setCities([nationwide, ...response.data])
    },
  })

  const { refetch } = useQuery({
    queryKey: [`recruiter-${profile.userId}-jobs`],
    queryFn: () => recruitersApi.getRecruiterJobs(profile.id),
    onSuccess: (response) => {
      setJobs(response.data)
    },
  })

  return (
    <div className='grid w-full grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-7 lg:px-0'>
      <RecruiterDescription {...profile} />
      <div className='lg:col-span-4'>
        <RecruiterJobs cities={cities} jobs={jobs} refetch={refetch} />
      </div>
    </div>
  )
}
