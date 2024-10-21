import { Navigate, Outlet } from 'react-router-dom'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'

const AdminRoute = () => {
  const { user } = useAppSelector((state) => state.user)

  return user?.role === 0 ? (
    <Outlet />
  ) : (
    <Navigate to={paths.userPaths.privateLogin} />
  )
}

export default AdminRoute
