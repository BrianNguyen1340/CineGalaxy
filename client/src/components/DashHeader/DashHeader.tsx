import React from 'react'
import { Bell, Menu, Moon, Send, Settings } from 'lucide-react'

import { MenuDropdown } from '~/components'
import './DashHeader.scss'

type DashHeaderProps = {
    openSidebar: boolean
    setOpenSidebar: (open: boolean) => void
}

const DashHeader: React.FC<DashHeaderProps> = ({
    openSidebar,
    setOpenSidebar,
}) => {
    return (
        <header className='dash-header-container'>
            <div className='upper-content'>
                <div
                    className={`body ${!openSidebar && 'rotate-180'}`}
                    onClick={() => setOpenSidebar(!openSidebar)}
                    title='sidebar toggle'
                >
                    <Menu />
                </div>
            </div>
            <div className='lower-content'>
                <div className='body'>
                    <Moon size='20' />
                    <Bell size='20' />
                    <Settings size='20' />
                    <Send size='20' />
                </div>
                <MenuDropdown />
            </div>
        </header>
    )
}

export default DashHeader
