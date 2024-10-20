import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'

const RequiredAuth = () => {
  const navigate = useNavigate()

  const { user, isAuthenticated } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (isAuthenticated && user?.role === 3) {
      navigate(paths.userPaths.home)
    }
  }, [isAuthenticated, user, navigate])

  return <Outlet />
}

export default RequiredAuth
