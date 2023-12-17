import Button from '@/components/Button'
import routes from '@/configs/route.config'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

export default function Unauthorized() {
  return (
    <div className='mx-auto my-20 flex flex-col items-center justify-center gap-6'>
      Bạn không có quyền truy cập vào trang này!
      <Link to={routes.home}>
        <Button>
          <FontAwesomeIcon icon={faChevronLeft} />
          Quay về trang chủ
        </Button>
      </Link>
    </div>
  )
}
