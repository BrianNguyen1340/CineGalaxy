import { Link } from 'react-router-dom'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'
import useTitle from '~/hooks/useTitle'

const NotFound = () => {
  useTitle('Trang không tồn tại')

  const user = useAppSelector((state) => state.user.user)

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center'>
      <div className='text-3xl font-semibold'>404 - Page Not Found</div>
      <p className='mt-4 text-xl'>
        Sorry, the page you are looking for does not exist.
      </p>
      {user?.role === 0 || user?.role === 1 || user?.role === 2 ? (
        <Link
          to={paths.dashboardPaths.dashboard}
          className='mt-[30px] text-[24px] underline'
        >
          Back to home!
        </Link>
      ) : (
        <Link
          to={paths.userPaths.home}
          className='hover mt-[30px] text-[24px] underline'
        >
          Back to home!
        </Link>
      )}
    </div>
  )
}

export default NotFound
