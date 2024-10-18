import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import './SidebarMenuItem.scss'

type SidebarMenuItemProps = {
  icon?: React.ReactNode
  title?: string
  spanTitle?: React.ReactNode
  onSelect: () => void
  path: string
  spanText?: string
  isSelected: boolean
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  spanTitle,
  spanText,
  title,
  icon,
  onSelect,
  path,
}) => {
  const location = useLocation()
  const isSelected = location.pathname === path

  return (
    <Link
      className={`sidebar-menu-item-container ${isSelected ? 'selected' : ''}`}
      title={title}
      to={path}
      onClick={onSelect}
      style={{
        backgroundColor: `${isSelected ? '#fff6f6' : ''}`,
        color: `${isSelected && '#000'}`,
      }}
    >
      <div className='content'>
        {icon
          ? icon
          : spanTitle && (
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  textAlign: 'center',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  boxShadow: '0 3px 6px rgba(83, 108, 167, .16)',
                  border: '2px solid #ccc',
                }}
              >
                {spanTitle}
              </div>
            )}
        <span style={{ textTransform: 'capitalize', fontSize: '14px' }}>
          {spanText}
        </span>
      </div>
    </Link>
  )
}

export default SidebarMenuItem
