import Button from '@/components/Button'
import routes from '@/configs/route.config'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className='flex h-96 w-screen items-center justify-center gap-4'>
      Trang bạn yêu cầu không tồn tại{' '}
      <Link to={routes.home}>
        <Button>Quay về trang chủ</Button>
      </Link>
    </div>
  )
}
