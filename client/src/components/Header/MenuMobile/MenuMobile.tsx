import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import { paths } from '~/utils/paths'

type MenuMobileProps = {
  className?: string
}

const MenuMobile: React.FC<MenuMobileProps> = ({ className }) => {
  const listVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <div
      className={`${className} absolute left-0 top-[100%] z-20 mt-0.5 h-fit w-full bg-white 1000px:hidden`}
    >
      <ul>
        <motion.li
          variants={listVariants}
          initial='hidden'
          animate='visible'
          transition={{ duration: 0.3, delay: 0.1 }}
          className='text-center'
        >
          <Link
            to={paths.userPaths.giftShop}
            className='block w-full py-4 font-semibold capitalize hover:bg-[#eee]'
            style={{ transition: '0.5s ease' }}
          >
            shop quà tặng
          </Link>
        </motion.li>
        <motion.li
          variants={listVariants}
          initial='hidden'
          animate='visible'
          transition={{ duration: 0.3, delay: 0.2 }}
          className='text-center'
        >
          <Link
            to={paths.userPaths.showtimes}
            className='block w-full py-4 font-semibold capitalize hover:bg-[#eee]'
            style={{ transition: '0.5s ease' }}
          >
            mua vé
          </Link>
        </motion.li>
        <motion.li
          variants={listVariants}
          initial='hidden'
          animate='visible'
          transition={{ duration: 0.3, delay: 0.3 }}
          className='text-center'
        >
          <Link
            to={paths.userPaths.cinemas}
            className='block w-full py-4 font-semibold capitalize hover:bg-[#eee]'
            style={{ transition: '0.5s ease' }}
          >
            rạp chiếu phim
          </Link>
        </motion.li>
        <motion.li
          variants={listVariants}
          initial='hidden'
          animate='visible'
          transition={{ duration: 0.3, delay: 0.4 }}
          className='text-center'
        >
          <Link
            to={paths.userPaths.promotions}
            className='block w-full py-4 font-semibold capitalize hover:bg-[#eee]'
            style={{ transition: '0.5s ease' }}
          >
            khuyến mãi
          </Link>
        </motion.li>
        <motion.li
          variants={listVariants}
          initial='hidden'
          animate='visible'
          transition={{ duration: 0.3, delay: 0.5 }}
          className='text-center'
        >
          <Link
            to={paths.userPaths.contact}
            className='block w-full py-4 font-semibold capitalize hover:bg-[#eee]'
            style={{ transition: '0.5s ease' }}
          >
            liên hệ
          </Link>
        </motion.li>
        <motion.li
          variants={listVariants}
          initial='hidden'
          animate='visible'
          transition={{ duration: 0.3, delay: 0.7 }}
          className='text-center 600px:hidden'
        >
          <Link
            to={paths.userPaths.support}
            className='block w-full py-4 font-semibold capitalize hover:bg-[#eee]'
            style={{ transition: '0.5s ease' }}
          >
            hỗ trợ
          </Link>
        </motion.li>
        <motion.li
          variants={listVariants}
          initial='hidden'
          animate='visible'
          transition={{ duration: 0.3, delay: 0.8 }}
          className='text-center 401px:hidden'
        >
          <Link
            to={paths.userPaths.login}
            className='block w-full py-4 font-semibold capitalize hover:bg-[#eee]'
            style={{ transition: '0.5s ease' }}
          >
            đăng nhập
          </Link>
        </motion.li>
        <motion.li
          variants={listVariants}
          initial='hidden'
          animate='visible'
          transition={{ duration: 0.3, delay: 0.9 }}
          className='text-center 401px:hidden'
        >
          <Link
            to={paths.userPaths.register}
            className='block w-full py-4 font-semibold capitalize hover:bg-[#eee]'
            style={{ transition: '0.5s ease' }}
          >
            đăng ký
          </Link>
        </motion.li>
      </ul>
    </div>
  )
}

export default MenuMobile
