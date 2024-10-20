import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'

const AdminRoute = () => {
  const navigate = useNavigate()

  const { user, isAuthenticated } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (isAuthenticated && user?.role === 0) {
      navigate(paths.dashboardPaths.dashboard)
    }
  }, [isAuthenticated, user, navigate])

  return <Outlet />
}

export default AdminRoute
