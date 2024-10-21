import { Navigate, Outlet } from 'react-router-dom'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'

const CashierRoute = () => {
  const { user } = useAppSelector((state) => state.user)

  return user?.role === 2 ? <Outlet /> : <Navigate to={paths.userPaths.login} />
}

export default CashierRoute
