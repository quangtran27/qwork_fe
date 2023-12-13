import userApi from '@/api/user.api'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Loading from '@/components/Loading'
import routes from '@/configs/route.config'
import { ApiResponse } from '@/types/api.type'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Link, useParams } from 'react-router-dom'

export default function ActiveUser() {
  const { email, token } = useParams()

  const { data, error, isLoading, isSuccess, isError } = useQuery({
    queryKey: [token],
    queryFn: () => userApi.activeUser(email || '', token || ''),
    enabled: !!token && !!email,
  })

  return (
    <div className='mx-auto w-full max-w-screen-xl py-4'>
      <Card>
        <div className='font-medium'>
          {isLoading ? (
            <div className='flex items-center justify-center'>
              Đang kích hoạt tài khoản của bạn <Loading />
            </div>
          ) : (
            <div className='flex flex-col items-center gap-2'>
              {isSuccess && data && (
                <div className='text-base font-normal'>
                  {data?.message ?? 'Thong bao thanh cong'},{' '}
                  <Link to={routes.login} className='font-semibold text-secondary'>
                    Đăng nhập
                  </Link>{' '}
                  ngay
                  <div className='text-center'>hoặc</div>
                </div>
              )}
              {isError && error && (
                <div className='text-error'>{((error as AxiosError).response?.data as ApiResponse<null>).message}</div>
              )}
              <Link to={routes.home}>
                <Button>
                  <FontAwesomeIcon icon={faHome} /> Quay về trang chủ
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
