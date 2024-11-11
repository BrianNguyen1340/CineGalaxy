import { Navigate } from 'react-router-dom'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'
import useTitle from '~/hooks/useTitle'

const Membership = () => {
  useTitle('Thẻ thành viên')

  const { isAuthenticated, user } = useAppSelector((state) => state.user)

  const isAuthorized =
    isAuthenticated &&
    (user?.role === 0 || user?.role === 1 || user?.role === 2)

  if (isAuthorized) {
    return <Navigate to={paths.dashboardPaths.dashboard} replace />
  }

  return <div></div>
}

export default Membership
