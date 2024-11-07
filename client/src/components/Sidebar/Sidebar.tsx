import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { GiFilmProjector } from 'react-icons/gi'
import { MdCategory } from 'react-icons/md'
import { SiShowtime } from 'react-icons/si'
import {
  Armchair,
  CircleParking,
  Clapperboard,
  Film,
  LogOut,
  ShieldCheck,
} from 'lucide-react'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

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

type SidebarProps = {
  openSidebar: boolean
  setOpenSidebar: (open: boolean) => void
  style?: React.CSSProperties
  className?: string
}

const Sidebar: React.FC<SidebarProps> = ({
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
    <aside
      className='fixed flex h-screen flex-col overflow-hidden border border-[#eee] bg-white shadow-custom'
      style={style}
    >
      <SidebarTop openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      <div className='px-4'>
        <hr />
        <hr />
      </div>
      <Scrollbar
        height='650px'
        content={
          <>
            <SidebarMenu
              className='pt-4'
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
                  className='flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-[6px] bg-[#ff9696] p-2 text-white transition duration-300 hover:opacity-70'
                  type='submit'
                  onClick={handleLogout}
                >
                  <div className='flex h-[30px] w-[30px] items-center justify-center rounded-[4px] border-2 border-[#f0f0f0] shadow-md'>
                    <LogOut size='16' />
                  </div>
                  <div className='text-sm capitalize'>
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
                  spanTitle='Thể loại phim'
                  icon={<MdCategory size='16' />}
                  item={
                    <>
                      <SidebarMenuItem
                        path={paths.dashboardPaths.managements.genres.list}
                        spanText='danh sách thể loại phim'
                        spanTitle='L'
                        isSelected={selectedMenuItem === location.pathname}
                        onSelect={() => setSelectedMenuItem(location.pathname)}
                      />
                      <SidebarMenuItem
                        path={paths.dashboardPaths.managements.genres.create}
                        spanText='tạo thể loại phim'
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
