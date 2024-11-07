import { Link } from 'react-router-dom'

import { paths } from '~/utils/paths'

const MainNavigation = () => {
  return (
    <nav className='row-start-1 row-end-1 hidden whitespace-nowrap text-sm font-semibold 1000px:col-start-2 1000px:col-end-3 1001px:block 1400px:col-start-1 1400px:col-end-2'>
      <ul className='flex items-center justify-center gap-3 1000px:col-start-2 1400px:col-start-1 1400px:col-end-2 1400px:justify-start'>
        <li style={{ paddingLeft: '0' }} className='relative flex items-center'>
          <Link
            to={paths.userPaths.giftShop}
            className='relative pb-[2px] capitalize after:absolute after:bottom-[-3px] after:left-0 after:h-[2px] after:w-0 after:bg-red-500 after:transition-all after:duration-500 hover:after:w-full'
          >
            shop quà tặng
          </Link>
        </li>
        <li className='relative flex items-center'>
          <Link
            to={paths.userPaths.showtimes}
            className='relative pb-[2px] capitalize after:absolute after:bottom-[-3px] after:left-0 after:h-[2px] after:w-0 after:bg-red-500 after:transition-all after:duration-500 hover:after:w-full'
          >
            mua vé
          </Link>
        </li>
        <li className='relative flex items-center'>
          <Link
            to={paths.userPaths.movieLists}
            className='relative pb-[2px] capitalize after:absolute after:bottom-[-3px] after:left-0 after:h-[2px] after:w-0 after:bg-red-500 after:transition-all after:duration-500 hover:after:w-full'
          >
            phim
          </Link>
        </li>
        <li className='relative flex items-center'>
          <Link
            to={paths.userPaths.cinemas}
            className='relative pb-[2px] capitalize after:absolute after:bottom-[-3px] after:left-0 after:h-[2px] after:w-0 after:bg-red-500 after:transition-all after:duration-500 hover:after:w-full'
          >
            rạp chiếu phim
          </Link>
        </li>
        <li className='relative flex items-center'>
          <Link
            to={paths.userPaths.promotions}
            className='relative pb-[2px] capitalize after:absolute after:bottom-[-3px] after:left-0 after:h-[2px] after:w-0 after:bg-red-500 after:transition-all after:duration-500 hover:after:w-full'
          >
            khuyến mãi
          </Link>
        </li>
        <li
          style={{ paddingRight: '0' }}
          className='relative flex items-center'
        >
          <Link
            to={paths.userPaths.contact}
            className='relative pb-[2px] capitalize after:absolute after:bottom-[-3px] after:left-0 after:h-[2px] after:w-0 after:bg-red-500 after:transition-all after:duration-500 hover:after:w-full'
          >
            liên hệ
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default MainNavigation
