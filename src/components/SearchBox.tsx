import { useAppDispatch } from '@/hook/useAppDispatch'
import { useAppSelector } from '@/hook/useAppSelector'
import { addHistory, clearHistories, deleteHistory, selectSearchHistories } from '@/redux/reducers/search-history'
import { City } from '@/types/addresses.type'
import { faClockRotateLeft, faClose, faLocationDot, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from './Button'
import TextInput from './TextInput'

type SearchBoxProps = {
  title?: string
  body?: ReactNode
  placeholder?: string
  searchPath: string
  cities?: City[]
}

export default function SearchBox({
  title = '',
  body = '',
  placeholder = '',
  searchPath = '',
  cities = [],
}: SearchBoxProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()

  const keyword = searchParams.get('keyword') || ''
  const city = searchParams.get('city') || '0'

  const searchRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState(keyword)
  const [selectedCity, setSelectedCity] = useState(city)

  const history = useAppSelector(selectSearchHistories).histories.find((h) => h.key === searchPath)
  const historyRef = useRef<HTMLDivElement>(null)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        historyRef.current &&
        !historyRef.current.contains(event.target as Node)
      ) {
        setShowHistory(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearch = () => {
    !!search && dispatch(addHistory({ key: searchPath, value: search }))
    navigate({
      pathname: searchPath,
      search: `?keyword=${search}${cities.length ? '&city=' + selectedCity : ''}`,
    })
  }

  return (
    <section className='flex justify-center bg-gradient-to-br from-blue-300 to-pink-200 py-12'>
      <div className='max-w-screen-lg rounded-2xl border bg-white p-4 shadow-sm lg:px-8 lg:py-6'>
        <h1 className='text-center text-xl font-semibold'>{title}</h1>
        <div className='my-4'>{body}</div>
        <div className='flex w-full flex-col gap-4 md:flex-row'>
          <div className='relative flex-1'>
            <TextInput
              autoComplete='off'
              className='min-w-[428px] max-w-full'
              insideClass='bg-gray-100'
              iconLeft={<FontAwesomeIcon className='text-gray-500' icon={faMagnifyingGlass} />}
              name='job-search'
              placeholder={placeholder}
              ref={searchRef}
              type='search'
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
              onFocus={() => {
                setShowHistory(true)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
            />
            {showHistory && history && history.values.length > 0 && (
              <div
                className='absolute inset-x-0 z-10 mt-2 space-y-2 rounded-b-2xl rounded-t-lg border bg-white p-3 shadow-xl'
                ref={historyRef}
              >
                <div className='flex items-center justify-between border-b pb-2'>
                  <div className='font-medium'>Từ khoá tìm kiếm gần đây</div>
                  <span
                    className='cursor-pointer text-sm text-red-600'
                    onClick={() => {
                      dispatch(clearHistories(searchPath))
                    }}
                  >
                    Xoá tất cả
                  </span>
                </div>
                {history.values.map((v) => (
                  <div
                    key={v}
                    className='btn btn-ghost w-full justify-start pr-0 font-normal normal-case hover:bg-gray-200'
                    onClick={async () => {
                      setShowHistory(false)
                      setSearch(v)
                    }}
                  >
                    <div className='flex flex-1 items-center gap-3'>
                      <span>
                        <FontAwesomeIcon icon={faClockRotateLeft} />
                      </span>
                      {v}
                    </div>
                    <span
                      className='flex h-full items-center px-4'
                      onClick={(e) => {
                        e.stopPropagation()
                        dispatch(deleteHistory({ key: searchPath, value: v }))
                      }}
                    >
                      <FontAwesomeIcon className='text-gray-500' icon={faClose} />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {cities.length ? (
            <div className='relative'>
              <span className='absolute inset-y-0 left-0 flex items-center px-4'>
                <FontAwesomeIcon icon={faLocationDot} />
              </span>
              <select
                className='select select-bordered rounded-full pl-10'
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value)
                }}
              >
                {cities.map((city) => (
                  <option key={city.code} value={city.code}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <></>
          )}
          <Button className='min-w-[140px]' color='secondary' onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </div>
      </div>
    </section>
  )
}
