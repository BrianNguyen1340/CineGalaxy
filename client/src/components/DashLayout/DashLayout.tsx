import React from 'react'
import { Outlet } from 'react-router-dom'

type DashLayoutProps = {
  openSidebar: boolean
}

const DashLayout: React.FC<DashLayoutProps> = () => {
  return <Outlet />
}

export default DashLayout
