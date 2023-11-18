import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReactNode, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from './Button'
import TextInput from './TextInput'

type SearchBoxProps = {
  title?: string
  body?: ReactNode
  placeholder?: string
  searchPath?: string
}

export default function SearchBox({ title = '', body = '', placeholder = '', searchPath = '' }: SearchBoxProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const searchValue = searchParams.get('keyword') || ''
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleSearch = () => {
    navigate({
      pathname: searchPath,
      search: `?keyword=${searchInputRef.current?.value || ''}`,
    })
  }

  return (
    <section className='flex justify-center bg-gradient-to-br from-blue-100 to-pink-100 py-12'>
      <div className='max-w-screen-lg border bg-white p-4 shadow-sm lg:rounded-2xl lg:px-8 lg:py-6'>
        <h1 className='text-center text-xl font-semibold'>{title}</h1>
        <div className='my-4'>{body}</div>
        <div className='flex w-full flex-col gap-4 md:flex-row'>
          <TextInput
            ref={searchInputRef}
            className='flex-1'
            insideClass='bg-gray-100'
            name='job-search'
            placeholder={placeholder}
            iconLeft={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            defaultValue={searchValue}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
          />
          <Button className='min-w-[140px]' color='secondary' onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </div>
      </div>
    </section>
  )
}
