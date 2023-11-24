import recruitersApi from '@/api/recruiters.api'
import Container from '@/components/Container'
import Pagination from '@/components/Pagination'
import Recruiter from '@/components/Recruiter'
import SearchBox from '@/components/SearchBox'
import { emptyPagination } from '@/constants/commons.constant'
import { Profile } from '@/types/profile.type'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'

export default function SearchRecruiters() {
  const [searchParams] = useSearchParams()
  const [recruiters, setRecruiters] = useState<Profile[]>([])
  const [pagination, setPagingation] = useState(emptyPagination)

  const keyword = searchParams.get('keyword') || ''
  const page = searchParams.get('page') || '1'

  const { refetch } = useQuery({
    queryFn: () => recruitersApi.getAll({ keyword: keyword, page: page }),
    onSuccess: (response) => {
      setRecruiters(response.data)
      setPagingation(response.pagination)
    },
  })

  useEffect(() => {
    if (keyword || page) {
      refetch()
    }
  }, [keyword, page, refetch])

  return (
    <div className='mt-header'>
      <SearchBox title='Tìm việc làm nhanh 24h, việc làm mới nhất và nhanh chóng trên toàn quốc' />
      <div className='my-4 lg:my-6'>
        <Container>
          <div className='w-full lg:px-0'>
            <div className='mb-4 flex w-full items-center justify-between'>
              <div className='flex items-center gap-3'>
                <h2>
                  Có {pagination.total} kết quả tìm kiếm cho nhà tuyển dụng:{' '}
                  <span className='text-xl font-semibold text-secondary'>{keyword}</span>
                </h2>
              </div>
            </div>
            {recruiters.length === 0 && (
              <p className='text-center text-gray-500'>Không có nhà tuyển dụng phù hợp với yêu cầu của bạn!</p>
            )}
            <div className='grid w-full grid-cols-1 gap-6 py-6 lg:grid-cols-3'>
              {recruiters.map((recruiter) => (
                <Recruiter key={recruiter.id} {...recruiter} />
              ))}
            </div>
          </div>
          <Pagination {...pagination} />
        </Container>
      </div>
    </div>
  )
}
