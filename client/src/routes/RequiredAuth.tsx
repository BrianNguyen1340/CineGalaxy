import { Outlet, Navigate } from 'react-router-dom'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'

// *****************************************************************************

const RequiredAuth = () => {
  const { user } = useAppSelector((state) => state.user)

  return user?.role === 3 ? (
    <Outlet />
  ) : (
    <Navigate to={paths.userPaths.login} replace />
  )
}

export default RequiredAuth
