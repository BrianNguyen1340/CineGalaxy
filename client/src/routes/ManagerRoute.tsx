import { Navigate, Outlet } from 'react-router-dom'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'

const ManagerRoute = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.user)

  return isAuthenticated && user?.role === 1 ? (
    <Outlet />
  ) : (
    <Navigate to={paths.userPaths.login} replace />
  )
}

export default ManagerRoute
