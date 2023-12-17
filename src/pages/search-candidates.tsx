import candidatesApi from '@/api/candidates.api'
import Candidate from '@/components/Candidate'
import Loading from '@/components/Loading'
import Pagination from '@/components/Pagination'
import SearchBox from '@/components/SearchBox'
import routes from '@/configs/route.config'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function SearchCandidates() {
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''
  const page = searchParams.get('page') || '1'

  const { data, isLoading, isFetched, refetch } = useQuery({
    queryKey: ['candidates', keyword, page],
    queryFn: () => candidatesApi.getAll({ keyword: keyword, page: page }),
  })

  const { data: outstandingCandidates, isLoading: isLoadingOutstandingCandidates } = useQuery({
    queryKey: ['candidates', 'outstanding'],
    queryFn: candidatesApi.getAll,
    enabled: isFetched && !data?.data.length,
  })

  useEffect(() => {
    document.title = 'Ứng cử viên - QWork'

    isFetched && refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isFetched])

  useEffect(() => {
    if (keyword || page) {
      refetch()
    }
  }, [keyword, page, refetch])

  return (
    <>
      <SearchBox
        title='Tìm ra các ứng cử viên phù hợp cho công việc của bạn'
        body={<></>}
        placeholder='Tên, vị trí ứng cử viên mà bạn mong muốn...'
        searchPath={routes.searchCandidate}
      />
      <div className='my-4'>
        <div className='mx-auto w-full max-w-screen-xl'>
          <div className='flex w-full items-center justify-between'>
            <div className='flex items-center gap-3'>
              <h2>
                Có {data?.pagination.total || 0} kết quả tìm kiếm cho ứng cử viên với từ khóa:{' '}
                <span className='text-lg font-medium text-primary'>{keyword}</span>
              </h2>
            </div>
          </div>
          <div className='w-full px-4 lg:px-0'>
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
          <div className='mt-8'>
            {isLoadingOutstandingCandidates ? (
              <div className='flex items-center'>
                Đang tải nhà tuyển dụng nổi bật <Loading />
              </div>
            ) : (
              outstandingCandidates?.data.length && (
                <>
                  <h3 className='text-h3'>Có thể bạn sẽ quan tâm</h3>
                  <div className='grid w-full grid-cols-1 gap-4 py-4 lg:grid-cols-3'>
                    {outstandingCandidates.data.map((candidate) => (
                      <Candidate key={candidate.id} {...candidate} />
                    ))}
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </>
  )
}
