import routes from '@/configs/route.config'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import Button from './Button'
import TextInput from './TextInput'

export default function Footer() {
  return (
    <footer className='lg:px bg-[#25314e] p-4 text-lg text-white lg:pt-8 lg:text-base'>
      <div className='mx-auto grid max-w-screen-xl grid-cols-1 gap-4 py-4 lg:grid-cols-5'>
        <div className='flex flex-col items-center justify-center gap-4'>
          <Link to={routes.home} className='relative block h-20 w-20'>
            <img src='/images/logo_square.png' alt='' className='absolute inset-0' />
          </Link>
          <p className='text-center italic'>QWork - Nền tảng tuyển dụng, tìm kiếm việc làm trực tuyến</p>
        </div>
        <div className='text-center lg:text-left'>
          <h3 className='text-h4 mb-3 pr-4 uppercase text-slate-400'>Về QWork</h3>
          <ul className='flex flex-col gap-2'>
            <li>
              <Link to={''} className='link-underline'>
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link to={''} className='link-underline'>
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link to={''} className='link-underline'>
                Điều khoản dịch vụ
              </Link>
            </li>
            <li>
              <Link to={''} className='link-underline'>
                Quy chế hoạt động
              </Link>
            </li>
          </ul>
        </div>
        <div className='text-center lg:text-left'>
          <h3 className='text-h4 mb-3 pr-4 uppercase text-slate-400'>Hồ sơ và CV</h3>
          <ul className='flex flex-col gap-2'>
            <li>
              <Link to={''} className='link-underline'>
                Quản lý hồ sơ của bạn
              </Link>
            </li>
            <li>
              <Link to={''} className='link-underline'>
                Hướng dẫn viết CV
              </Link>
            </li>
            <li>
              <Link to={''} className='link-underline'>
                Kinh nghiệm ứng tuyển
              </Link>
            </li>
          </ul>
        </div>
        <div className='text-center lg:col-span-2 lg:text-left'>
          <h3 className='text-h4 mb-3 pr-4 uppercase text-slate-400'>Tham gia với chúng tôi</h3>
          <p className='mb-4'>Nhận ngay những thông báo mới nhất về QWork</p>
          <form>
            <div className='flex flex-col gap-3 lg:flex-row'>
              <TextInput
                className='w-full text-gray-800'
                placeholder='Nhập email của bạn'
                iconLeft={<FontAwesomeIcon icon={faEnvelope} />}
              />
              <Button className='min-w-[140px]'>Đăng ký</Button>
            </div>
          </form>
        </div>
      </div>
      <div>
        <p className='mx-auto mt-4 block max-w-screen-xl border-t border-slate-500 py-6 text-center text-slate-400'>
          (c) 2023 QWork. All copyrights reserved.
        </p>
      </div>
    </footer>
  )
}
