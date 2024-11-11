import { Navigate } from 'react-router-dom'
import { DateSelector } from '~/components'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'
import useTitle from '~/hooks/useTitle'

const Showtimes = () => {
  useTitle('Suất chiếu')

  const { isAuthenticated, user } = useAppSelector((state) => state.user)

  const isAuthorized =
    isAuthenticated &&
    (user?.role === 0 || user?.role === 1 || user?.role === 2)

  if (isAuthorized) {
    return <Navigate to={paths.dashboardPaths.dashboard} replace />
  }

  return (
    <div className='relative h-full w-full bg-[#faf6ec]'>
      <div className='mx-auto w-[1000px]'>
        <div className='py-10 text-center text-xl font-semibold capitalize'>
          suất chiếu phim
        </div>
        <DateSelector />
        <div className='mt-10 border-t-2 border-black'>
          <div className='flex items-center'>
            <div className='w-[650px]'>
              <div className='border-b-2 p-6 text-xl font-semibold capitalize'>
                rạp
              </div>
            </div>
            <div className='w-[350px] border-l-2'>
              <div className='border-b-2 p-6 text-xl font-semibold capitalize'>
                phim
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Showtimes
