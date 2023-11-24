import routes from '@/configs/route.config'
import { menuItems } from '@/constants/header.constant'
import { useAppSelector } from '@/hook/useAppSelector'
import useLogout from '@/hook/useLogout'
import { selectAuth } from '@/redux/reducers/auth-slice'
import { faBars, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Button from './Button'
import { UpdateProfileAction } from '@/types/profile.type'

export default function Header() {
  const auth = useAppSelector(selectAuth)
  const logout = useLogout()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate(routes.login)
  }

  return (
    <div className='drawer drawer-end'>
      <input id='header-drawer' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content flex flex-col'>
        <div className='fixed inset-x-0 top-0 z-10 h-header w-full border bg-white px-4 shadow-sm'>
          <div className='mx-auto flex h-full w-full items-center justify-between lg:max-w-screen-xl'>
            <div className='flex h-full w-full items-center justify-between px-4 lg:justify-normal lg:px-[unset]'>
              <Link className='first:mr-6' to={routes.home}>
                <figure className='relative hidden h-12 w-32 lg:block'>
                  <img src='/images/logo.png' alt='qwork logo' />
                </figure>
                <figure className='relative h-10 w-28 lg:hidden'>
                  <img src='/images/logo.png' alt='qwork logo' />
                </figure>
              </Link>
              {menuItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.to}
                  className={({ isActive }) => 'hidden font-semibold lg:inline-block' + (isActive ? ' active' : '')}
                >
                  <Button className='text-base hover:bg-gray-100' color='ghost'>
                    {item.label}
                  </Button>
                </NavLink>
              ))}
              <label htmlFor='header-drawer' className='drawer-button block lg:hidden'>
                <FontAwesomeIcon icon={faBars} size='2x' />
              </label>
            </div>
            {auth.id ? (
              <div className='dropdown dropdown-end hidden lg:block'>
                <label tabIndex={0} className='btn btn-ghost flex flex-nowrap rounded-full font-bold'>
                  <span className='whitespace-nowrap'>{auth.name}</span>
                  <FontAwesomeIcon icon={faChevronDown} />
                </label>
                <ul tabIndex={0} className='menu dropdown-content rounded-box z-[1] w-52 bg-white p-2 text-base shadow'>
                  <li>
                    <Link to={routes.profile.replace(':id', auth.id)}>Hồ sơ của tôi</Link>
                  </li>
                  <li>
                    <Link to={`${routes.profile.replace(':id', auth.id)}?action=${UpdateProfileAction.updatePassword}`}>
                      Đổi mật khẩu
                    </Link>
                  </li>
                  <li>
                    <span onClick={handleLogout}>Đăng xuất</span>
                  </li>
                </ul>
              </div>
            ) : (
              <Link className='hidden lg:block' to={routes.login}>
                <Button color='primary' className='min-w-[140px] whitespace-nowrap'>
                  Đăng nhập
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* For tablet and mobile */}
      <div className='drawer-side z-10'>
        <label htmlFor='header-drawer' aria-label='close sidebar' className='drawer-overlay'></label>
        <div className='flex max-h-full min-h-full w-80 flex-col items-end bg-white p-6'>
          <label className='text-right text-2xl' htmlFor='header-drawer' aria-label='close sidebar'>
            ✕
          </label>
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                'link-underline text-right text-lg font-semibold' + (isActive ? ' active' : '')
              }
            >
              {item.label}
            </NavLink>
          ))}
          {auth.id ? (
            <>
              <NavLink
                to={routes.profile.replace(':id', auth.id)}
                className={({ isActive }) =>
                  'link-underline text-right text-lg font-semibold' + (isActive ? ' active' : '')
                }
              >
                Hồ sơ của tôi
              </NavLink>
              <div onClick={handleLogout} className='link-underline text-right text-lg font-semibold'>
                Đăng xuất
              </div>
            </>
          ) : (
            <Link className='my-3 text-right' to={routes.login}>
              <Button color='primary' className='min-w-[140px] whitespace-nowrap'>
                Đăng nhập
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
