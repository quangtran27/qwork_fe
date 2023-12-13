import recruitersApi from '@/api/recruiters.api'
import Container from '@/components/Container'
import Loading from '@/components/Loading'
import Pagination from '@/components/Pagination'
import Recruiter from '@/components/Recruiter'
import SearchBox from '@/components/SearchBox'
import routes from '@/configs/route.config'
import { Profile } from '@/types/profile.type'
import { emptyResponse } from '@/utils/sample/api.sample'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function SearchRecruiters() {
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''
  const page = searchParams.get('page') || '1'

  const { data, isLoading, isFetched, refetch } = useQuery({
    queryKey: ['recruiters', keyword, page],
    queryFn: () => recruitersApi.getAll({ keyword: keyword, page: page }),
    initialData: emptyResponse<Profile[]>([]),
  })

  const { data: outstandingRecruiterRes, isLoading: isLoadingOutstandingRecruiters } = useQuery({
    queryKey: ['recruiters', 'outstanding'],
    queryFn: recruitersApi.getOutstandingRecruiters,
    enabled: isFetched && !data.data.length,
  })

  useEffect(() => {
    if (keyword || page) {
      refetch()
    }
  }, [keyword, page, refetch])

  return (
    <>
      <SearchBox
        title='Khám phá nhà tuyển dụng nổi bật trên QWork'
        body={
          <p className='text-center'>
            Các công ty doanh nghiệp đang tuyển dụng, hàng nghìn công việc được đăng mới mỗi ngày!
          </p>
        }
        placeholder='Nhập tên công ty...'
        searchPath={routes.searchRecruiters}
      />
      <div className='my-4 lg:my-6'>
        <Container>
          <div className='flex w-full items-center justify-between'>
            <div className='flex items-center gap-3'>
              <h2>
                Có {data?.pagination.total || 0} kết quả tìm kiếm cho nhà tuyển dụng:{' '}
                <span className='text-lg font-medium text-primary'>{keyword}</span>
              </h2>
            </div>
          </div>
          <div className='w-full px-4 lg:px-0'>
            {isLoading ? (
              <div className='flex items-center justify-center'>
                Đang tìm kiếm kết quả cho nhà tuyển dụng:{' '}
                <span className='ml-2 font-medium text-secondary'>{keyword}</span> <Loading />
              </div>
            ) : data?.data.length ? (
              <>
                <div className='grid w-full grid-cols-1 gap-4 py-4 lg:grid-cols-3'>
                  {data.data.map((recruiter) => (
                    <Recruiter key={recruiter.id} {...recruiter} />
                  ))}
                </div>
              </>
            ) : (
              <div className='mt-2 flex flex-col items-center rounded-2xl border bg-white p-8 shadow-sm'>
                <img className='h-48 w-48' src='/images/none-result.webp' />
                Rất tiếc, không có nhà tuyển dụng phù hợp với yêu cầu của bạn!
              </div>
            )}
          </div>
          {data?.pagination && <Pagination {...data.pagination} />}
          <div className='mt-8'>
            {isLoadingOutstandingRecruiters ? (
              <div className='flex items-center'>
                Đang tải nhà tuyển dụng nổi bật <Loading />
              </div>
            ) : (
              outstandingRecruiterRes?.data.length && (
                <>
                  <h3 className='text-h3'>Có thể bạn sẽ quan tâm</h3>
                  <div className='grid w-full grid-cols-1 gap-4 py-4 lg:grid-cols-3'>
                    {outstandingRecruiterRes.data.map((recruiter) => (
                      <Recruiter key={recruiter.id} {...recruiter} />
                    ))}
                  </div>
                </>
              )
            )}
          </div>
        </Container>
      </div>
    </>
  )
}
