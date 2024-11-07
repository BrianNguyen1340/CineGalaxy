import React from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '~/hooks/redux'

import { paths } from '~/utils/paths'

type SidebarTopProps = {
  className?: string
  openSidebar: boolean
  setOpenSidebar: (open: boolean) => void
  style?: React.CSSProperties
}

const SidebarTop: React.FC<SidebarTopProps> = () => {
  const user = useAppSelector((state) => state.user.user as { role: 0 | 1 | 2 })

  return (
    <Link
      to={paths.dashboardPaths.dashboard}
      className='relative flex h-[60px] w-full items-center justify-center p-4 overflow-hidden gap-2'
    >
      <div className='capitalize text-2xl'>
        {user?.role === 0 && <>admin</>}
        {user?.role === 1 && <>manager</>}
        {user?.role === 2 && <>cashier</>}
      </div>
    </Link>
  )
}

export default SidebarTop
