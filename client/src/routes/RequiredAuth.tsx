import { Outlet, Navigate } from 'react-router-dom'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'

// *****************************************************************************

const RequiredAuth = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.user)

  return user?.role === 3 && isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={paths.userPaths.login} />
  )
}

export default RequiredAuth
