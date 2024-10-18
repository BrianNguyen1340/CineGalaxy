import { ChevronDown } from 'lucide-react'
import { FC, ReactNode, useState } from 'react'

import './SidebarMenu.scss'

type SidebarMenuProps = {
  img?: string
  user?: ReactNode
  icon?: ReactNode
  item: ReactNode
  button?: ReactNode
  spanTitle?: string
  className?: string
  style?: React.CSSProperties
}

const SidebarMenu: FC<SidebarMenuProps> = ({
  item,
  icon,
  img,
  user,
  button,
  spanTitle,
  style,
  className,
}) => {
  const [openSidebarMenu, setOpenSidebarMenu] = useState<boolean>(false)

  return (
    <div className={`sidebar-menu-container ${className}`} style={style}>
      <div
        className={`upper-content ${openSidebarMenu ? 'mb-1' : 'mb-0'}`}
        onClick={() => setOpenSidebarMenu(!openSidebarMenu)}
      >
        <div className='title'>
          {icon && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '30px',
                width: '30px',
                borderRadius: '4px',
                boxShadow: '0 3px 6px rgba(83, 108, 167, .16)',
                border: '2px solid #4cc9f0',
              }}
            >
              {icon}
            </div>
          )}
          {spanTitle && <span className='span-title'>{spanTitle}</span>}
          {img && <img src={img} alt='avatar' />}
          {user && <span className='duration-300 span-userdata'>{user}</span>}
        </div>
        <div
          style={{
            transition: `${openSidebarMenu ? '0.3s ease' : '0.3s ease'}`,
          }}
          className={`dropdown-btn ${openSidebarMenu && 'rotate-180'}`}
        >
          <ChevronDown size='20' color='#00acc1' />
        </div>
      </div>
      <div
        className='lower-content'
        style={{
          height: `${openSidebarMenu ? 'fit-content' : '0'}`,
          opacity: `${openSidebarMenu ? '1' : '0'}`,
        }}
      >
        {item}
        {button}
      </div>
    </div>
  )
}

export default SidebarMenu
