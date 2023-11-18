import { usePagination } from '@/hook/usePagination'
import { PaginationParams } from '@/types/api.type'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate, useSearchParams } from 'react-router-dom'

type PaginationProps = PaginationParams & {
  defaultPage?: number
}

export default function Pagination({ ...props }: PaginationProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paginationRange = usePagination(props)

  const handleChangePage = (page: number) => {
    searchParams.set('page', page.toString())
    navigate({ search: searchParams.toString() })
  }

  if (props.page === 0 || props.numPages < 2 || paginationRange.length === 0) {
    return <></>
  }

  const onNext = () => {
    handleChangePage(props.page + 1)
  }

  const onPrevious = () => {
    handleChangePage(props.page - 1)
  }

  return (
    <ul className='flex items-center gap-2 rounded-full'>
      <li className={`${props.page === 1 && 'btn-disabled'} btn btn-circle btn-sm`} onClick={onPrevious}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </li>
      {paginationRange.map((page) => {
        if (page === -1) return <li key={page}>...</li>

        return (
          <li
            key={page}
            className={`${page === props.page && 'btn-active'} btn btn-circle btn-sm`}
            onClick={() => {
              handleChangePage(page)
            }}
          >
            {page}
          </li>
        )
      })}
      <li className={`${props.page === props.numPages && 'btn-disabled'} btn btn-circle btn-sm`} onClick={onNext}>
        <FontAwesomeIcon icon={faChevronRight} />
      </li>
    </ul>
  )
}
