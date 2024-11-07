import React from 'react'
import { Menu, X } from 'lucide-react'

type ToggleHeaderButtonProps = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  style?: React.CSSProperties
  isMenuMobileOpen?: boolean
}

const ToggleHeaderButton: React.FC<ToggleHeaderButtonProps> = ({
  onClick,
  style,
  isMenuMobileOpen,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${!isMenuMobileOpen && 'rotate-180'} h-[30px] w-fit cursor-pointer bg-white transition duration-300 1001px:hidden`}
      style={style}
    >
      {isMenuMobileOpen ? (
        <X size={30} strokeWidth={2.5} />
      ) : (
        <Menu size={30} strokeWidth={2.5} />
      )}
    </button>
  )
}

export default ToggleHeaderButton
