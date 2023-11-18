import { emptyUpdateJob } from '@/constants/jobs.constant'
import { useAppSelector } from '@/hook/useAppSelector'
import { City } from '@/types/addresses.type'
import { ApiResponse } from '@/types/api.type'
import { Job as IJob, UpdateJob as IUpdateJob } from '@/types/jobs.type'
import { selectAuth, selectProfile } from '@/redux/reducers/auth-slice'
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import { QueryObserverResult, RefetchOptions } from 'react-query'
import Button from './Button'
import DeleteJob from './DeleteJob'
import Job from './Job'
import TextInput from './TextInput'
import UpdateJob from './UpdateJob'
import { useSearchParams } from 'react-router-dom'

type RecruiterJobsProps = {
  cities?: City[]
  jobs?: IJob[]
  refetch: (option?: RefetchOptions) => Promise<QueryObserverResult<ApiResponse<IJob[]>, unknown>>
}

export default function RecruiterJobs({ cities = [], jobs: propJobs = [], refetch }: RecruiterJobsProps) {
  const auth = useAppSelector(selectAuth)
  const profile = useAppSelector(selectProfile)
  const updateJobRef = useRef<HTMLDialogElement>(null)
  const deleteJobRef = useRef<HTMLDialogElement>(null)
  const [jobs, setJobs] = useState<IJob[]>(propJobs)
  const [selectedJob, setselectedJob] = useState<IUpdateJob>(emptyUpdateJob)
  const [deleteJob, setDeleteJob] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState<string>('')
  const [selectedCityCode, setSelectedCityCode] = useState(0)

  const [searchParams] = useSearchParams()
  const showedApplicationJob = searchParams.get('show')

  useEffect(() => {
    setJobs(propJobs)
  }, [propJobs])

  useEffect(() => {
    if (selectedJob.id != '-1') {
      updateJobRef.current?.showModal()
    }
  }, [selectedJob])

  useEffect(() => {
    if (deleteJob) {
      deleteJobRef.current?.show()
    }
  }, [deleteJob])

  const handleSearchJobs = () => {
    setJobs(
      propJobs.filter(
        (job) =>
          job.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) &&
          (selectedCityCode === 0 || job.cityCode === selectedCityCode),
      ),
    )
  }

  const onUpdateJobSuccess = async () => {
    updateJobRef.current?.close()
    setselectedJob(emptyUpdateJob)
    refetch()
  }

  const onDeleteJobSuccess = async () => {
    deleteJobRef.current?.close()
    setDeleteJob(null)
    refetch()
  }

  return (
    <div className='mb-6 flex flex-col gap-6'>
      <div className='flex flex-col gap-2 rounded-3xl bg-white p-4 shadow'>
        <h3 className='text-h3 text-center lg:text-left'>Thông tin tuyển dụng</h3>
        <div className='flex flex-col gap-4 lg:flex-row'>
          <TextInput
            className='flex-1'
            iconLeft={<FontAwesomeIcon className='text-gray-500' icon={faMagnifyingGlass} />}
            placeholder='Tên công việc, vị trí ứng tuyển'
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
            }}
          />
          <select
            className='select select-bordered rounded-full'
            value={selectedCityCode}
            onChange={(e) => {
              setSelectedCityCode(parseInt(e.target.value))
            }}
          >
            {cities.map((city) => (
              <option key={city.code} value={city.code}>
                {city.name}
              </option>
            ))}
          </select>
          <Button color='secondary' onClick={handleSearchJobs}>
            Tìm kiếm
          </Button>
        </div>
      </div>
      {auth.id === profile.userId && (
        <div className='divider'>
          <Button
            color='success'
            onClick={() => {
              setselectedJob({ ...emptyUpdateJob, id: '0' })
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
            Đăng tin tuyển dụng mới
          </Button>
        </div>
      )}
      <p className='-my-2'>
        Tổng cộng: <span className='text-lg font-bold text-primary'>{jobs.length}</span> tin tuyển dụng
      </p>
      <div className='flex flex-col gap-6'>
        {jobs.map((job) => (
          <div key={job.id} className='relative'>
            <Job
              {...job}
              showController
              showApplications={showedApplicationJob === job.id}
              onEdit={() => {
                setselectedJob({ ...job })
              }}
              onDelete={() => {
                setDeleteJob(job.id)
              }}
            />
          </div>
        ))}
        {!jobs.length && <div className='text-center'>Không có tin tuyển dụng phù hợp</div>}
      </div>
      <UpdateJob
        key={selectedJob.id}
        job={selectedJob}
        mode={selectedJob.id != '0' ? 'update' : 'create'}
        cities={cities}
        ref={updateJobRef}
        onSuccess={onUpdateJobSuccess}
        onCancel={() => setselectedJob(emptyUpdateJob)}
      />
      <DeleteJob
        id={deleteJob || ''}
        ref={deleteJobRef}
        onSuccess={onDeleteJobSuccess}
        onCancel={() => setDeleteJob(null)}
      />
    </div>
  )
}
