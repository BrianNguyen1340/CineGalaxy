import React from 'react'

import './DashFooter.scss'

type DashFooterProps = {
  openSidebar: boolean
}

const DashFooter: React.FC<DashFooterProps> = () => {
  return (
    <footer className='dash-footer-container'>
      Copyright © {new Date().getFullYear()}. All rights reserved.
    </footer>
  )
}

export default DashFooter
