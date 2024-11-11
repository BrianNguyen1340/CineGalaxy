import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import { paths } from '~/utils/paths'

const Logo = () => {
  return (
    <motion.div
      className='col-start-2 col-end-3 row-start-1 row-end-1 flex h-full items-center justify-center text-3xl 1000px:col-start-1 1000px:col-end-2 1400px:col-start-2 1400px:col-end-3'
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
