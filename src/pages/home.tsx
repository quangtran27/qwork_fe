import jobsApi from '@/api/jobs.api'
import recruitersApi from '@/api/recruiters.api'
import Job from '@/components/Job'
import Recruiter from '@/components/Recruiter'
import SearchBox from '@/components/SearchBox'
import routes from '@/configs/route.config'
import { Job as IJob } from '@/types/jobs.type'
import { Profile } from '@/types/profile.type'
import { faBuilding, faFire } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'

export default function Home() {
  const [jobs, setJobs] = useState<IJob[]>([])
  const [recruiters, setRecruiters] = useState<Profile[]>([])

  const { isLoading: isLoadingJobs } = useQuery({
    queryKey: ['outstanding-jobs'],
    queryFn: jobsApi.getOutstandingJobs,
    onSuccess: (response) => {
      setJobs(() =>
        response.data.map((job) => {
          return { aplications: [], ...job }
        }),
      )
    },
  })

  const { isLoading: isLoadingRecruiters } = useQuery({
    queryKey: ['outstanding-recruiters'],
    queryFn: recruitersApi.getOutstandingRecruiters,
    onSuccess: (repsonse) => {
      setRecruiters(repsonse.data)
    },
  })

  return (
    <div className='mt-header'>
      <SearchBox
        title='Tìm việc làm nhanh 24h, việc làm mới nhất và nhanh chóng trên toàn quốc'
        body={<></>}
        placeholder='Tên công việc, vị trí ứng tuyển'
        searchPath={routes.searchJobs}
      />

      <section className='mt-8 px-4 lg:px-0'>
        <div className='mx-auto max-w-screen-xl'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3 text-2xl'>
              <FontAwesomeIcon icon={faBuilding} shake className='text-primary' />
              <h3 className='text-h3'>Nhà tuyển dụng nổi bật</h3>
            </div>
            <Link className='hover:link' to={routes.recruiters}>
              Xem tất cả
            </Link>
          </div>
          {!isLoadingRecruiters && !recruiters.length && (
            <p className='text-center text-base'>Hiện tại chưa có nhà tuyển dụng nào phù hợp</p>
          )}
          <div className='grid grid-cols-1 gap-6 py-6 md:grid-cols-3'>
            {isLoadingRecruiters && (
              <div className='col-span-3 text-center'>
                <span className='loading'></span>
              </div>
            )}
            {recruiters.map((recruiter) => (
              <Recruiter key={recruiter.id} {...recruiter} />
            ))}
          </div>
        </div>
      </section>
      <section className='mt-4 px-4 lg:px-0'>
        <div className='mx-auto max-w-screen-xl'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <FontAwesomeIcon icon={faFire} bounce className='text-xl text-secondary' />
              <h3 className='text-h3'>Việc làm hot</h3>
            </div>
            <Link className='hover:link' to={routes.jobs}>
              Xem tất cả
            </Link>
          </div>
          {!isLoadingJobs && !jobs.length && (
            <p className='text-center text-base'>Hiện tại chưa có việc làm nào phù hợp</p>
          )}
          <div className='grid grid-cols-1 gap-6 py-6 md:grid-cols-3'>
            {isLoadingJobs && (
              <div className='col-span-3 text-center'>
                <span className='loading'></span>
              </div>
            )}
            {jobs.map((job) => (
              <Job key={job.id} {...job} onEdit={() => {}} onDelete={() => {}} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
