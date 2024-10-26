import React from 'react'
import { Outlet } from 'react-router-dom'

type DashLayoutProps = {
  openSidebar: boolean
}

const DashLayout: React.FC<DashLayoutProps> = ({ openSidebar }) => {
  return (
    <div className={`dash-layout ${openSidebar ? 'sidebar-open' : ''}`}>
      <Outlet />
    </div>
  )
}

export default DashLayout
