import routes from '@/configs/route.config'
import { useAppSelector } from '@/hook/useAppSelector'
import { selectAuth } from '@/redux/reducers/auth-slice'
import { UserRoles } from '@/types/users.type'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

type RequireAuthProps = {
  allows: UserRoles[]
}

export default function RequireAuth({ ...props }: RequireAuthProps) {
  const auth = useAppSelector(selectAuth)
  const location = useLocation()

  return props.allows.includes(auth.user.role) ? (
    <Outlet></Outlet>
  ) : auth.token ? (
    <Navigate to={routes.unauthorized} state={{ from: location }} />
  ) : (
    <Navigate to={routes.login} state={{ from: location }} />
  )
}
