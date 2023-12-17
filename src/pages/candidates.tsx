import candidatesApi from '@/api/candidates.api'
import Candidate from '@/components/Candidate'
import Loading from '@/components/Loading'
import Pagination from '@/components/Pagination'
import SearchBox from '@/components/SearchBox'
import routes from '@/configs/route.config'
import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function Candidates() {
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || '1')

  const { data, isLoading, isFetched, refetch } = useQuery({
    queryKey: ['candidates', page],
    queryFn: () => candidatesApi.getAll({ page: page }),
  })

  useEffect(() => {
    document.title = 'Ứng cử viên - QWork'

    isFetched && refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isFetched])

  return (
    <div className='pb-4'>
      <SearchBox
        title='Tìm ra các ứng cử viên phù hợp cho công việc của bạn'
        body={<></>}
        placeholder='Tên, vị trí ứng cử viên mà bạn mong muốn...'
        searchPath={routes.searchCandidate}
      />
      <div className='mx-auto w-full max-w-screen-xl'>
        <div className='w-full'>
          <div className='mt-8 px-4 lg:px-0'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <FontAwesomeIcon icon={faPeopleGroup} className='text-xl text-secondary' />
                <h3 className='text-h3'>Tất cả ứng cử viên</h3>
              </div>
            </div>
            {isLoading ? (
              <Loading content='Đang tải danh sách công việc' />
            ) : data?.data.length ? (
              <div className='grid grid-cols-1 gap-4 py-4 lg:grid-cols-3'>
                {data.data.map((candidate) => (
                  <Candidate key={candidate.id} {...candidate} />
                ))}
              </div>
            ) : (
              <div className='mt-2 flex flex-col items-center rounded-2xl border bg-white p-8 shadow-sm'>
                <img className='h-48 w-48' src='/images/none-result.webp' />
                Rất tiếc, không có ứng cử viên phù hợp với yêu cầu của bạn!
              </div>
            )}
          </div>
          {data?.pagination && (
            <div className='flex justify-center'>
              <Pagination {...data.pagination} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
