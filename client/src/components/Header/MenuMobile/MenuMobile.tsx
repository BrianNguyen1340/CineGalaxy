import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import { paths } from '~/utils/paths'
import './MenuMobile.scss'

type MenuMobileProps = {
    className?: React.CSSProperties
}

const MenuMobile: React.FC<MenuMobileProps> = ({ className }) => {
    const listVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
    }

    const menuItems = [
        { to: paths.userPaths.giftShop, label: 'shop quà tặng' },
        { to: paths.userPaths.showtimes, label: 'mua vé' },
        { to: paths.userPaths.movieLists, label: 'phim' },
        { to: paths.userPaths.cinemas, label: 'rạp chiếu phim' },
        { to: paths.userPaths.promotions, label: 'khuyến mãi' },
        { to: paths.userPaths.contact, label: 'liên hệ' },
        { to: paths.userPaths.membership, label: 'thành viên' },
        { to: paths.userPaths.support, label: 'hỗ trợ' },
        { to: paths.userPaths.login, label: 'đăng nhập' },
        { to: paths.userPaths.register, label: 'đăng ký' },
    ]

    return (
        <div className={`${className} menu-mobile`}>
            <ul>
                {menuItems.map((item, index) => (
                    <motion.li
                        key={item.to}
                        variants={listVariants}
                        initial='hidden'
                        animate='visible'
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <Link to={item.to}>{item.label}</Link>
                    </motion.li>
                ))}
                <div style={{ padding: '10px 0' }} className='hr-menu-mobile'>
                    <hr />
                </div>
            </ul>
        </div>
    )
}

export default MenuMobile
