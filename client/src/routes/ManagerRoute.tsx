import { Navigate, Outlet } from 'react-router-dom'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'

const ManagerRoute = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.user)

  return user?.role === 1 && isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={paths.userPaths.login} />
  )
}

export default ManagerRoute
