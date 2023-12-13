import routes from '@/configs/route.config'
import useLogout from '@/hook/useLogout'
import { faShield, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink, useNavigate } from 'react-router-dom'
import Card from './Card'

export default function AccountSettingMenu() {
  const logout = useLogout()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate(routes.login)
  }

  return (
    <Card>
      <h2 className='text-h2'>Cài đặt tài khoản</h2>
      <ul className='menu rounded-box menu-lg mt-4 p-0'>
        <li>
          <NavLink
            to={routes.account}
            className={({ isActive }) => {
              return (isActive ? 'active' : '') + ' rounded-xl'
            }}
          >
            <FontAwesomeIcon icon={faUser} /> Thông tin cá nhân
          </NavLink>
        </li>
        <li>
          <NavLink
            to={routes.changePassword}
            className={({ isActive }) => {
              return (isActive ? 'active' : '') + ' rounded-xl'
            }}
          >
            <FontAwesomeIcon icon={faShield} />
            Mật khẩu
          </NavLink>
        </li>
        <li>
          <span className='rounded-xl text-error hover:text-error' onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOut} />
            Đăng xuất
          </span>
        </li>
      </ul>
    </Card>
  )
}
