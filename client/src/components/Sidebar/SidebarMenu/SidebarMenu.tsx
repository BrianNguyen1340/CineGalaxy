import { ChevronDown } from 'lucide-react'
import { FC, ReactNode, useState } from 'react'

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
    <div className={`${className} mb-1 flex flex-col px-4`} style={style}>
      <div
        className={`${openSidebarMenu ? 'mb-1' : 'mb-0'} mb-1 flex cursor-pointer items-center justify-between rounded-[6px] bg-[#f4f4f4] p-2 transition duration-300`}
        onClick={() => setOpenSidebarMenu(!openSidebarMenu)}
      >
        <div className='flex items-center gap-4'>
          {icon && (
            <div className='flex h-[30px] w-[30px] items-center justify-center rounded-[4px] border-2 border-[#4cc9f0] shadow-md'>
              {icon}
            </div>
          )}
          {spanTitle && (
            <span className='text-sm font-semibold capitalize'>
              {spanTitle}
            </span>
          )}
          {img && (
            <img
              src={img}
              alt='avatar'
              className='h-10 w-10 rounded-full text-sm'
            />
          )}
          {user && (
            <span className='text-sm font-semibold capitalize transition duration-300'>
              {user}
            </span>
          )}
        </div>
        <div
          className={`${openSidebarMenu && 'rotate-180'} flex cursor-pointer items-center justify-center transition duration-300`}
        >
          <ChevronDown size='20' color='#00acc1' />
        </div>
      </div>
      <div
        className={`${openSidebarMenu ? 'opacity-1 h-fit' : 'h-0 opacity-0'} flex w-full flex-col gap-1 overflow-hidden transition duration-300`}
      >
        {item}
        {button}
      </div>
    </div>
  )
}

export default SidebarMenu
