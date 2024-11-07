import { useState } from 'react'

import {
  ToggleHeaderButton,
  MenuMobile,
  MainNavigation,
  DynamicNavigation,
  Logo,
} from '~/components'

const Header = () => {
  const [isMenuMobileOpen, setIsMenuMobileOpen] = useState<boolean>(false)

  const toggleMenu = () => {
    setIsMenuMobileOpen(!isMenuMobileOpen)
  }

  return (
    <header className='relative flex h-full w-full items-center justify-center shadow-md'>
      <div className='grid h-full w-full grid-cols-[30px_auto] grid-rows-[100px] items-center gap-0 px-5 500px:gap-x-5 700px:px-10 1001px:grid-cols-[150px_auto_auto] 1400px:grid-cols-[1fr_150px_1fr]'>
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
