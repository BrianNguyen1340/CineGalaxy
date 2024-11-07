import React, { useEffect, useState } from 'react'
import { Menu, Moon, Sun } from 'lucide-react'

import { MenuDropdown } from '~/components'

type DashHeaderProps = {
  openSidebar: boolean
  setOpenSidebar: (open: boolean) => void
}

const DashHeader: React.FC<DashHeaderProps> = ({
  openSidebar,
  setOpenSidebar,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <header className='relative flex items-center justify-between rounded-b-xl bg-white p-4 shadow-custom dark:bg-[#212529]'>
      <div className='flex items-center p-4'>
        <div
          className={`${!openSidebar && 'rotate-180'} ${isDarkMode && 'text-white'} flex cursor-pointer items-center justify-center transition`}
          onClick={() => setOpenSidebar(!openSidebar)}
          title='sidebar toggle'
        >
          <Menu />
        </div>
      </div>
      <div className='flex items-center p-4'>
        <div className='relative mr-4 flex items-center gap-4'>
          <button onClick={toggleDarkMode} title='Toggle dark mode'>
            {isDarkMode ? (
              <Sun size='24' color='#ffb703' />
            ) : (
              <Moon size='24' />
            )}
          </button>
        </div>
        <MenuDropdown />
      </div>
    </header>
  )
}

export default DashHeader
