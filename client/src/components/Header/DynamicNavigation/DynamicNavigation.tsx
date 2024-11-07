import { Link } from 'react-router-dom'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'
import { MenuDropdown } from '~/components'

const DynamicNavigation = () => {
  const user = useAppSelector((state) => state.user.user)

  return (
    <nav className='relative col-start-3 col-end-4 row-start-1 row-end-1 hidden whitespace-nowrap text-sm font-semibold 420px:grid'>
      {user ? (
        <MenuDropdown />
      ) : (
        <ul className='flex items-center justify-end gap-3'>
          <li className='relative flex items-center'>
            <Link
              to={paths.userPaths.support}
              className='after:ease relative hidden pb-0.5 capitalize after:absolute after:bottom-[-3px] after:left-0 after:h-[2px] after:w-0 after:bg-red-500 after:transition-all after:duration-500 hover:after:w-full 600px:block'
            >
              hỗ trợ
            </Link>
          </li>
          <li className='relative flex items-center'>
            <Link
              to={paths.userPaths.login}
              className='after:ease relative pb-0.5 capitalize after:absolute after:bottom-[-3px] after:left-0 after:h-[2px] after:w-0 after:bg-red-500 after:transition-all after:duration-500 hover:after:w-full'
            >
              đăng nhập
            </Link>
          </li>
          <li className='relative flex items-center'>
            <Link
              to={paths.userPaths.register}
              className='ease rounded-md border border-[#ff3c78] bg-[#ff3c78] p-3 capitalize text-white transition-all duration-300 after:content-none hover:border-black hover:bg-white hover:text-black'
            >
              đăng ký
            </Link>
          </li>
        </ul>
      )}
    </nav>
  )
}

export default DynamicNavigation
