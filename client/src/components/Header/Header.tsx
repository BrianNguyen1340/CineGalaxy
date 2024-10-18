import { useEffect, useState } from 'react'

import {
    ToggleHeaderButton,
    MenuMobile,
    MainNavigation,
    DynamicNavigation,
    Logo,
} from '~/components'
import './Header.scss'

const Header = () => {
    const [isMenuMobileOpen, setIsMenuMobileOpen] = useState<boolean>(false)
    const [isLargeScreen, setIsLargeScreen] = useState<boolean>(
        window.innerWidth > 1000,
    )

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth > 1000)
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const toggleMenu = () => {
        setIsMenuMobileOpen(!isMenuMobileOpen)
    }

    return (
        <header
            style={{
                backgroundColor: `${isLargeScreen ? '#f8f7f4' : isMenuMobileOpen ? '#fff' : '#f8f7f4'}`,
            }}
        >
            <div className='wrapper'>
                <ToggleHeaderButton
                    onClick={toggleMenu}
                    isMenuMobileOpen={isMenuMobileOpen}
                />
                <div className={`${isMenuMobileOpen && 'dark-overlay'}`} />
                {isMenuMobileOpen && <MenuMobile />}
                <MainNavigation />
                <Logo />
                <DynamicNavigation />
            </div>
        </header>
    )
}

export default Header
