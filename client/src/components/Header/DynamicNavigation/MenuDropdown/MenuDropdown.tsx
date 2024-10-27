import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, User } from 'lucide-react'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'
import { useLogoutMutation } from '~/services/auth.service'
import { logout } from '~/redux/reducers/user.reducer'
import './MenuDropdown.scss'

const MenuDropdown = () => {
  const user = useAppSelector((state) => state.user.user)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [logoutApi, { isLoading }] = useLogoutMutation()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Bạn có chắc',
      text: 'Muốn đăng  xuất?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Vâng, đăng xuất!',
      cancelButtonText: 'Không, tiếp tục đăng nhập!',
    })
    if (result.isConfirmed) {
      try {
        nProgress.start()
        const response = await logoutApi({}).unwrap()
        dispatch(logout())
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: response?.message || 'You have been logged out successfully.',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        })
        navigate(paths.userPaths.login)
      } catch (error: any) {
        Swal.fire('Thất bại', error.message, 'error')
      } finally {
        nProgress.done()
      }
    }
  }

  return (
    <div className='menu-dropdown-container'>
      <div className='wrapper' ref={dropdownRef}>
        <div className='content'>
          <div className='image-wrapper'>
            <img src={user?.photoURL} alt='avatar' />
          </div>
          <button
            onClick={toggleDropdown}
            className={`btn-show-hide-menu-dropdown ${isOpen && 'rotate-180'}`}
          >
            <ChevronDown
              style={{
                backgroundColor: `${user?.role === 3 ? '#f8f7f4' : '#fff'}`,
              }}
            />
          </button>
        </div>
        {isOpen && (
          <ul className='menu-dropdown'>
            {user?.role === 3 && (
              <>
                <li onClick={() => setIsOpen(false)}>
                  <Link to={paths.userPaths.account}>
                    <User size='14' />
                    <span>Tài khoản</span>
                  </Link>
                </li>
                <li onClick={() => setIsOpen(false)}>
                  <Link to={paths.userPaths.membership}>
                    <User size='14' />
                    <span>Thẻ thành viên</span>
                  </Link>
                </li>
              </>
            )}
            {user?.role === 0 && (
              <li onClick={() => setIsOpen(false)}>
                <Link to={paths.dashboardPaths.privateProfile}>
                  <User size='14' />
                  <span>Tài khoản</span>
                </Link>
              </li>
            )}
            {user?.role === 1 && (
              <li onClick={() => setIsOpen(false)}>
                <Link to={paths.dashboardPaths.privateProfile}>
                  <User size='14' />
                  <span>Tài khoản</span>
                </Link>
              </li>
            )}
            {user?.role === 2 && (
              <li onClick={() => setIsOpen(false)}>
                <Link to={paths.dashboardPaths.privateProfile}>
                  <User size='14' />
                  <span>Tài khoản</span>
                </Link>
              </li>
            )}
            <li onClick={() => setIsOpen(false)}>
              <button
                disabled={isLoading ? true : false}
                onClick={handleLogout}
              >
                <LogOut size='14' />
                <span>{isLoading ? 'Đang đăng xuất' : 'Đăng xuất'}</span>
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  )
}

export default MenuDropdown
