import Button from '@/components/Button'
import routes from '@/configs/route.config'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  useEffect(() => {
    document.title = 'QWork - Trang không tồn tại'
  }, [])

  return (
    <div className='flex h-96 w-screen items-center justify-center gap-4'>
      Trang bạn yêu cầu không tồn tại{' '}
      <Link to={routes.home}>
        <Button>Quay về trang chủ</Button>
      </Link>
    </div>
  )
}
