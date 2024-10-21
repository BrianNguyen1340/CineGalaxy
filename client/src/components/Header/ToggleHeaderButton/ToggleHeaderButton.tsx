import React from 'react'
import { Menu, X } from 'lucide-react'

import './ToggleHeaderButton.scss'

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
      className={`toggle-header-button ${!isMenuMobileOpen && 'rotate-180'}`}
      style={style}
    >
      {isMenuMobileOpen ? (
        <X
          size={30}
          strokeWidth={2.5}
          style={{
            backgroundColor: `${isMenuMobileOpen ? '#ffffff' : '#f8f7f4'}`,
          }}
        />
      ) : (
        <Menu
          size={30}
          strokeWidth={2.5}
          style={{
            backgroundColor: `${isMenuMobileOpen ? '#ffffff' : '#f8f7f4'}`,
          }}
        />
      )}
    </button>
  )
}

export default ToggleHeaderButton
