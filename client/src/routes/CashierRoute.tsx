import { Navigate, Outlet } from 'react-router-dom'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'

const CashierRoute = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.user)

  return isAuthenticated && user?.role === 2 ? (
    <Outlet />
  ) : (
    <Navigate to={paths.userPaths.login} replace />
  )
}

export default CashierRoute
