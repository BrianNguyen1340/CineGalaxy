import React from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '~/hooks/redux'

import { paths } from '~/utils/paths'
import './SidebarTop.scss'

type SidebarTopProps = {
  className?: string
  openSidebar: boolean
  setOpenSidebar: (open: boolean) => void
  style?: React.CSSProperties
}

const SidebarTop: React.FC<SidebarTopProps> = () => {
  const user = useAppSelector((state) => state.user.user as { role: 0 | 1 | 2 })

  return (
    <Link to={paths.dashboardPaths.dashboard} className='sidebar-top-container'>
      <div className='content'>
        {user?.role === 0 && <>admin</>}
        {user?.role === 1 && <>manager</>}
        {user?.role === 2 && <>cashier</>}
      </div>
    </Link>
  )
}

export default SidebarTop
