import { Navigate } from 'react-router-dom'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'
import useTitle from '~/hooks/useTitle'

const GiftShop = () => {
  useTitle('Shop quà tặng')
  const { isAuthenticated, user } = useAppSelector((state) => state.user)
  const isAuthorized =
    isAuthenticated &&
    (user?.role === 0 || user?.role === 1 || user?.role === 2)
  if (isAuthorized) {
    return <Navigate to={paths.dashboardPaths.dashboard} replace />
  }

  return <div className='relative h-full w-full'></div>
}

export default GiftShop
