import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'
import { useLogoutMutation } from '~/services/auth.service'
import { logout } from '~/redux/reducers/user.reducer'

const MenuDropdown = () => {
  const { user } = useAppSelector((state) => state.user)

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
    <div className='col-start-3 col-end-4 row-start-1 row-end-1 flex items-center justify-end whitespace-nowrap text-sm font-semibold'>
      <div
        className='relative flex h-full w-fit items-center justify-end gap-2'
        ref={dropdownRef}
      >
        <div>Xin chào {user?.name}</div>
        <div className='rounded-full border-[3px] border-[#90e0ef]'>
          <button
            onClick={toggleDropdown}
            className='flex items-center justify-between gap-3 rounded-3xl hover:shadow'
            style={{ transition: '0.5s ease' }}
          >
            <div className='flex items-center justify-center overflow-hidden rounded-full'>
              <img
                src={user?.photoURL}
                alt='avatar'
                className='h-[45px] w-[45px] object-cover'
              />
            </div>
          </button>
        </div>
        {isOpen && (
          <ul className='absolute right-0 top-[100%] z-10 mt-[10px] flex w-[200px] flex-col justify-start gap-0 overflow-hidden rounded-xl border-t border-[#ccc] bg-white shadow-custom'>
            {user?.role === 3 && (
              <>
                <li
                  onClick={() => setIsOpen(false)}
                  className='relative w-full'
                >
                  <Link
                    to={paths.userPaths.account}
                    className='m-0 flex w-full items-center gap-1 p-4 text-base font-normal hover:bg-[#f6f6f6]'
                    style={{ transition: '0.5s ease' }}
                  >
                    <User size='14' />
                    <span>Tài khoản</span>
                  </Link>
                </li>
                <li
                  onClick={() => setIsOpen(false)}
                  className='relative w-full'
                >
                  <Link
                    to={paths.userPaths.membership}
                    className='m-0 flex w-full items-center gap-1 p-4 text-base font-normal hover:bg-[#f6f6f6]'
                    style={{ transition: '0.5s ease' }}
                  >
                    <User size='14' />
                    <span>Thẻ thành viên</span>
                  </Link>
                </li>
              </>
            )}
            {user?.role === 0 && (
              <li onClick={() => setIsOpen(false)} className='relative w-full'>
                <Link
                  to={paths.dashboardPaths.privateProfile}
                  className='m-0 flex w-full items-center gap-1 p-4 text-base font-normal hover:bg-[#f6f6f6]'
                  style={{ transition: '0.5s ease' }}
                >
                  <User size='14' />
                  <span>Tài khoản</span>
                </Link>
              </li>
            )}
            {user?.role === 1 && (
              <li onClick={() => setIsOpen(false)} className='relative w-full'>
                <Link
                  to={paths.dashboardPaths.privateProfile}
                  className='m-0 flex w-full items-center gap-1 p-4 text-base font-normal hover:bg-[#f6f6f6]'
                  style={{ transition: '0.5s ease' }}
                >
                  <User size='14' />
                  <span>Tài khoản</span>
                </Link>
              </li>
            )}
            {user?.role === 2 && (
              <li onClick={() => setIsOpen(false)} className='relative w-full'>
                <Link
                  to={paths.dashboardPaths.privateProfile}
                  className='m-0 flex w-full items-center gap-1 p-4 text-base font-normal hover:bg-[#f6f6f6]'
                  style={{ transition: '0.5s ease' }}
                >
                  <User size='14' />
                  <span>Tài khoản</span>
                </Link>
              </li>
            )}
            <li onClick={() => setIsOpen(false)} className='relative w-full'>
              <button
                disabled={isLoading ? true : false}
                onClick={handleLogout}
                className='flex w-full cursor-pointer items-center gap-1 bg-transparent p-4 text-start text-base font-normal transition duration-300 hover:bg-[#f6f6f6]'
                style={{ fontFamily: 'Figtree' }}
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
