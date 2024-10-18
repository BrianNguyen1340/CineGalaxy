import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { paths } from '~/utils/paths'
import './Logo.scss'

const Logo = () => {
    return (
        <motion.div
            className='logo-header'
            style={{ fontFamily: 'Dancing Script' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Link to={paths.userPaths.home}>CineGalaxy</Link>
        </motion.div>
    )
}

export default Logo
