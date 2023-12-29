import addressesApi from '@/api/addresses.api'
import recruitersApi from '@/api/recruiters.api'
import { emptyUpdateJob } from '@/constants/jobs.constant'
import { nationwide } from '@/constants/location.constant'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth, selectProfile } from '@/redux/reducers/auth-slice'
import { UpdateJob as IUpdateJob } from '@/types/jobs.type'
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQueries } from '@tanstack/react-query'
import { Editor, EditorState, convertFromRaw } from 'draft-js'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from './Button'
import Card from './Card'
import DeleteJob from './DeleteJob'
import Job from './Job'
import Loading from './Loading'
import Pagination from './Pagination'
import TextInput from './TextInput'
import UpdateJob from './UpdateJob'

export default function RecruiterJobs() {
  const auth = useAppSelector(selectAuth)
  const profile = useAppSelector(selectProfile)
  const navigate = useNavigate()
  const updateJobRef = useRef<HTMLDialogElement>(null)
  const deleteJobRef = useRef<HTMLDialogElement>(null)
  const [selectedJob, setselectedJob] = useState<IUpdateJob>(emptyUpdateJob)
  const [deleteJob, setDeleteJob] = useState<string | null>(null)

  const [searchParams] = useSearchParams()
  const showedApplicationJob = searchParams.get('show')
  const page = searchParams.get('page') || '1'
  const city = searchParams.get('city') || '0'
  const keyword = searchParams.get('keyword') || ''

  const [{ data, isLoading, refetch }, { data: citiesRes }] = useQueries({
    queries: [
      {
        queryKey: ['recruiter-jobs', profile.id, page, city, keyword],
        queryFn: () => recruitersApi.getRecruiterJobs(profile.id, { keyword: keyword, city: city, page: page }),
        enabled: !!profile.userId,
      },
      {
        queryKey: ['cities'],
        queryFn: addressesApi.getAllCities,
      },
    ],
  })

  const [search, setSearch] = useState<string>(keyword)
  const [selectedCity, setSelectedCity] = useState(city)

  let editorState = EditorState.createEmpty()
  try {
    editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(profile.description)))
  } catch {}

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

  useEffect(() => {
    if (keyword || page) {
      refetch()
    }
  }, [keyword, city, page, refetch])

  const handleSearch = () => {
    navigate({
      search: `?keyword=${search}${citiesRes?.data.length ? '&city=' + selectedCity : ''}`,
    })
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
    <div className='mx-4 grid grid-cols-1 gap-4 py-4 lg:mx-0 lg:grid-cols-5'>
      <div className='lg:col-span-2'>
        <Card>
          <h3 className='text-h3 mb-3 text-center lg:text-left'>Giới thiệu</h3>
          <div className='text-justify text-lg lg:text-base'>
            {profile.description ? (
              <div className='prose w-full max-w-full text-base'>
                <Editor editorState={editorState} readOnly onChange={() => {}} />
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center text-gray-500'>
                <img className='h-48 w-48' src='/images/none-result.webp' />
                <span className='text-sm'>Chưa có thông tin nhà tuyển dụng</span>
              </div>
            )}
          </div>
        </Card>
      </div>
      <div className='flex flex-col gap-4 lg:col-span-3'>
        <Card>
          <h3 className='text-h3 mb-3 text-center lg:text-left'>Thông tin tuyển dụng</h3>
          <div className='flex flex-col gap-4 lg:flex-row'>
            <TextInput
              className='flex-1'
              iconLeft={<FontAwesomeIcon className='text-gray-500' icon={faMagnifyingGlass} />}
              placeholder='Tên công việc, vị trí ứng tuyển...'
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
            />
            <select
              className='select select-bordered rounded-full'
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value)
              }}
            >
              {citiesRes &&
                [nationwide, ...citiesRes.data].map((city) => (
                  <option key={city.code} value={city.code}>
                    {city.name}
                  </option>
                ))}
            </select>
            <Button color='secondary' onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </div>
        </Card>
        {auth.user.id === profile.userId && (
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
          Tổng cộng: <span className='text-lg font-bold text-primary'>{data?.pagination.total}</span> tin tuyển dụng
        </p>

        {isLoading ? (
          <Loading content='Đang tải tin tuyển dụng' />
        ) : data?.data && data.data.length > 0 ? (
          <div className='grid gap-4'>
            {data?.data.map((job) => (
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
            {data?.pagination && (
              <div className='flex justify-center'>
                <Pagination {...data.pagination} />
              </div>
            )}
          </div>
        ) : (
          <div className='mt-2 flex flex-col items-center rounded-2xl border bg-white p-8 shadow-sm'>
            <img className='h-48 w-48' src='/images/none-result.webp' />
            Rất tiếc, không có công việc phù hợp với yêu cầu của bạn!
          </div>
        )}
        <UpdateJob
          key={selectedJob.id}
          job={selectedJob}
          mode={selectedJob.id != '0' ? 'update' : 'create'}
          cities={citiesRes?.data ? [nationwide, ...citiesRes?.data] : undefined}
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
    </div>
  )
}
