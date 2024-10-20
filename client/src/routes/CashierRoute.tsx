import { Navigate, Outlet } from 'react-router-dom'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'

const CashierRoute = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.user)

  return user?.role === 2 && isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={paths.userPaths.login} />
  )
}

export default CashierRoute
