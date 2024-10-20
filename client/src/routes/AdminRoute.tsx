import { Navigate, Outlet } from 'react-router-dom'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'

const AdminRoute = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.user)

  return user?.role === 0 && isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={paths.userPaths.privateLogin} />
  )
}

export default AdminRoute
