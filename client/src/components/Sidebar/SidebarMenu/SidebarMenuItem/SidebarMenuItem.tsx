import React from 'react'
import { Link, useLocation } from 'react-router-dom'

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
      className={`${isSelected && 'selected bg-[#fff6f6]'} flex w-full items-center justify-start gap-4 overflow-hidden rounded p-2 font-semibold text-gray-800 transition duration-300 hover:bg-[#fff6f6]`}
      title={title}
      to={path}
      onClick={onSelect}
    >
      <div className='flex items-center gap-4'>
        {icon
          ? icon
          : spanTitle && (
              <div className='flex h-7 w-7 items-center justify-center rounded border-2 border-[#ccc] text-center font-semibold capitalize shadow-md'>
                {spanTitle}
              </div>
            )}
        <span className='text-sm capitalize'>{spanText}</span>
      </div>
    </Link>
  )
}

export default SidebarMenuItem
