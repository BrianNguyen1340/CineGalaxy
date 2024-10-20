import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'

const CashierRoute = () => {
  const navigate = useNavigate()

  const { user, isAuthenticated } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (isAuthenticated && user?.role === 2) {
      navigate(paths.dashboardPaths.dashboard)
    }
  }, [isAuthenticated, user, navigate])

  return <Outlet />
}

export default CashierRoute
