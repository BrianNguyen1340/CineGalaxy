import { Link } from 'react-router-dom'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'
import { MenuDropdown } from '~/components'
import './DynamicNavigation.scss'

const DynamicNavigation = () => {
  const user = useAppSelector((state) => state.user.user)

  return (
    <nav className='dynamic-navigation'>
      {user ? (
        <MenuDropdown />
      ) : (
        <ul className='dynamic-navigation-menu'>
          <li>
            <Link to={paths.userPaths.support}>hỗ trợ</Link>
          </li>
          <li>
            <Link to={paths.userPaths.login}>đăng nhập</Link>
          </li>
          <li>
            <Link to={paths.userPaths.register}>đăng ký</Link>
          </li>
        </ul>
      )}
    </nav>
  )
}

export default DynamicNavigation
