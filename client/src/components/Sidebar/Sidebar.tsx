import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'
import { GiFilmProjector } from 'react-icons/gi'
import { MdCategory } from 'react-icons/md'
import { SiShowtime } from 'react-icons/si'

import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { useLogoutMutation } from '~/services/auth.service'
import { paths } from '~/utils/paths'
import { logout } from '~/redux/reducers/user.reducer'
import {
  Scrollbar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTop,
} from '~/components'
import {
  Armchair,
  CircleParking,
  Clapperboard,
  Film,
  LogOut,
  ShieldCheck,
} from 'lucide-react'
import './Sidebar.scss'

type SidebarProps = {
  className?: string
  openSidebar: boolean
  setOpenSidebar: (open: boolean) => void
  style?: React.CSSProperties
}

const Sidebar: React.FC<SidebarProps> = ({
  className,
  openSidebar,
  setOpenSidebar,
  style,
}) => {
  const user = useAppSelector((state) => state.user.user)

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [selectedMenuItem, setSelectedMenuItem] = useState(location.pathname)

  const [logoutApi, { isLoading }] = useLogoutMutation()

  useEffect(() => {
    setSelectedMenuItem(location.pathname)
  }, [location])

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
    <aside className={`sidebar-container ${className}`} style={style}>
      <SidebarTop openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      <div
        style={{
          padding: '0 16px',
        }}
      >
        <hr />
        <hr />
      </div>
      <Scrollbar
        height='650px'
        content={
          <>
            <SidebarMenu
              style={{ paddingTop: '16px' }}
              user={`${user?.name}`}
              img={user?.photoURL}
              item={
                <SidebarMenuItem
                  path={paths.dashboardPaths.privateProfile}
                  spanText='profile'
                  spanTitle={<CircleParking size='16' />}
                  isSelected={selectedMenuItem === location.pathname}
                  onSelect={() => setSelectedMenuItem(location.pathname)}
                />
              }
              button={
                <button
                  className='btn-logout'
                  type='submit'
                  onClick={handleLogout}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '30px',
                      height: '30px',
                      borderRadius: '4px',
                      boxShadow: '0 3px 6px rgba(83, 108, 167, .16)',
                      border: '2px solid #f0f0f0',
                    }}
                  >
                    <LogOut size='16' />
                  </div>
                  <div
                    style={{
                      textTransform: 'capitalize',
                      fontSize: '14px',
                    }}
                  >
                    {isLoading ? 'Đang đăng xuất' : 'Đăng xuất'}
                  </div>
                </button>
              }
            />
            {user?.role === 0 && (
              <>
                <SidebarMenu
                  spanTitle='Tài khoản'
                  icon={<ShieldCheck size='16' />}
                  item={
                    <>
                      <SidebarMenuItem
                        path={paths.dashboardPaths.managements.accounts.list}
                        spanText='danh sách tài khoản'
                        spanTitle='L'
                        isSelected={selectedMenuItem === location.pathname}
                        onSelect={() => setSelectedMenuItem(location.pathname)}
                      />
                      <SidebarMenuItem
                        path={paths.dashboardPaths.managements.accounts.create}
                        spanText='tạo tài khoản'
                        spanTitle='C'
                        isSelected={selectedMenuItem === location.pathname}
                        onSelect={() => setSelectedMenuItem(location.pathname)}
                      />
                    </>
                  }
                />
                <SidebarMenu
                  spanTitle='Cụm rạp'
                  icon={<Clapperboard size='16' />}
                  item={
                    <>
                      <SidebarMenuItem
                        path={
                          paths.dashboardPaths.managements.cinemaComplexes.list
                        }
                        spanText='danh sách cụm rạp'
                        spanTitle='L'
                        isSelected={selectedMenuItem === location.pathname}
                        onSelect={() => setSelectedMenuItem(location.pathname)}
                      />
                      <SidebarMenuItem
                        path={
                          paths.dashboardPaths.managements.cinemaComplexes
                            .create
                        }
                        spanText='tạo cụm rạp'
                        spanTitle='C'
                        isSelected={selectedMenuItem === location.pathname}
                        onSelect={() => setSelectedMenuItem(location.pathname)}
                      />
                    </>
                  }
                />
                <SidebarMenu
                  spanTitle='Rạp'
                  icon={<Clapperboard size='16' />}
                  item={
                    <>
                      <SidebarMenuItem
                        path={paths.dashboardPaths.managements.cinemas.list}
                        spanText='danh sách rạp'
                        spanTitle='L'
                        isSelected={selectedMenuItem === location.pathname}
                        onSelect={() => setSelectedMenuItem(location.pathname)}
                      />
                      <SidebarMenuItem
                        path={paths.dashboardPaths.managements.cinemas.create}
                        spanText='tạo rạp'
                        spanTitle='C'
                        isSelected={selectedMenuItem === location.pathname}
                        onSelect={() => setSelectedMenuItem(location.pathname)}
                      />
                    </>
                  }
                />
                <SidebarMenu
                  spanTitle='Danh mục phim'
                  icon={<MdCategory size='16' />}
                  item={
                    <>
                      <SidebarMenuItem
                        path={
                          paths.dashboardPaths.managements.movieCategories.list
                        }
                        spanText='danh sách danh mục phim'
                        spanTitle='L'
                        isSelected={selectedMenuItem === location.pathname}
                        onSelect={() => setSelectedMenuItem(location.pathname)}
                      />
                      <SidebarMenuItem
                        path={
                          paths.dashboardPaths.managements.movieCategories
                            .create
                        }
                        spanText='tạo danh mục phim'
                        spanTitle='C'
                        isSelected={selectedMenuItem === location.pathname}
                        onSelect={() => setSelectedMenuItem(location.pathname)}
                      />
                    </>
                  }
                />
                <SidebarMenu
                  spanTitle='Phim'
                  icon={<Film size='16' />}
                  item={
                    <>
                      <SidebarMenuItem
                        path={paths.dashboardPaths.managements.movies.list}
                        spanText='danh sách phim'
                        spanTitle='L'
                        isSelected={selectedMenuItem === location.pathname}
                        onSelect={() => setSelectedMenuItem(location.pathname)}
                      />
                      <SidebarMenuItem
                        path={paths.dashboardPaths.managements.movies.create}
                        spanText='tạo phim'
                        spanTitle='C'
                        isSelected={selectedMenuItem === location.pathname}
                        onSelect={() => setSelectedMenuItem(location.pathname)}
                      />
                    </>
                  }
                />
                <SidebarMenu
                  spanTitle='Phòng'
                  icon={<GiFilmProjector size='16' />}
                  item={
                    <>
                      <SidebarMenuItem
                        path={paths.dashboardPaths.managements.rooms.list}
                        spanText='danh sách phòng'
                        spanTitle='L'
                        isSelected={selectedMenuItem === location.pathname}
                        onSelect={() => setSelectedMenuItem(location.pathname)}
                      />
                      <SidebarMenuItem
                        path={paths.dashboardPaths.managements.rooms.create}
                        spanText='tạo phòng'
                        spanTitle='C'
                        isSelected={selectedMenuItem === location.pathname}
                        onSelect={() => setSelectedMenuItem(location.pathname)}
                      />
                    </>
                  }
                />
                <SidebarMenu
                  spanTitle='Ghế'
                  icon={<Armchair size='16' />}
                  item={
                    <>
                      <SidebarMenuItem
                        path={paths.dashboardPaths.managements.seats.list}
                        spanText='danh sách ghế'
                        spanTitle='L'
                        isSelected={selectedMenuItem === location.pathname}
                        onSelect={() => setSelectedMenuItem(location.pathname)}
                      />
                      <SidebarMenuItem
                        path={paths.dashboardPaths.managements.seats.create}
                        spanText='tạo ghế'
                        spanTitle='C'
                        isSelected={selectedMenuItem === location.pathname}
                        onSelect={() => setSelectedMenuItem(location.pathname)}
                      />
                    </>
                  }
                />
              </>
            )}
            {user?.role === 1 && (
              <>
                <SidebarMenu
                  spanTitle='Suất chiếu'
                  icon={<SiShowtime size='16' />}
                  item={
                    <>
                      <SidebarMenuItem
                        path={paths.dashboardPaths.managements.showtimes.list}
                        spanText='danh sách suất chiếu'
                        spanTitle='L'
                        isSelected={selectedMenuItem === location.pathname}
                        onSelect={() => setSelectedMenuItem(location.pathname)}
                      />
                      <SidebarMenuItem
                        path={paths.dashboardPaths.managements.showtimes.create}
                        spanText='tạo suất chiếu'
                        spanTitle='C'
                        isSelected={selectedMenuItem === location.pathname}
                        onSelect={() => setSelectedMenuItem(location.pathname)}
                      />
                    </>
                  }
                />
              </>
            )}
          </>
        }
      />
    </aside>
  )
}

export default Sidebar
