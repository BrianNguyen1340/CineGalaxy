import { useEffect, useState, useMemo, CSSProperties } from 'react'
import { useLocation } from 'react-router-dom'
import 'nprogress/nprogress.css'
import 'react-circular-progressbar/dist/styles.css'
import 'react-day-picker/style.css'

import {
  DashHeader,
  DashLayout,
  Footer,
  Header,
  MainLayout,
  Sidebar,
} from '~/components'
import { paths } from '~/utils/paths'
import { useAppSelector } from '~/hooks/redux'
import { NotFound } from '~/pages'

const App = () => {
  const { user } = useAppSelector((state) => state.user)
  const location = useLocation()

  const [openSidebar, setOpenSidebar] = useState(true)

  const hideHeaderFooterPaths = useMemo(
    () => [
      paths.userPaths.login,
      paths.userPaths.register,
      paths.userPaths.verifyOtp,
      paths.userPaths.forgotPassword,
      paths.userPaths.privateLogin,
      paths.userPaths.privateForgotPassword,
      paths.userPaths.privateResetPassword,
      paths.dashboardPaths.dashboard,
    ],
    [],
  )

  const hideHeaderFooter = useMemo(
    () => hideHeaderFooterPaths.includes(location.pathname),
    [location.pathname, hideHeaderFooterPaths],
  )

  const isNotFound = useMemo(
    () => location.pathname === paths.userPaths.notFound,
    [location.pathname],
  )

  const sidebarStyle: CSSProperties = useMemo(
    () => ({
      width: openSidebar ? '288px' : '0',
      left: openSidebar ? '0' : '-100%',
      border: '1px solid #eee',
    }),
    [openSidebar],
  )

  const mainStyle: CSSProperties = useMemo(
    () => ({
      display: 'flex',
      flexDirection: 'column' as const,
      backgroundColor: 'transparent',
      position: 'relative',
      width: openSidebar ? 'calc(100% - 288px)' : '100%',
      marginLeft: openSidebar ? '304px' : '0',
      gap: '10px',
    }),
    [openSidebar],
  )

  if (isNotFound) {
    return <NotFound />
  }

  return (
    <>
      {user?.role === 0 || user?.role === 1 || user?.role === 2 ? (
        <div style={{ display: 'flex', width: '100%' }}>
          <Sidebar
            openSidebar={openSidebar}
            setOpenSidebar={setOpenSidebar}
            style={sidebarStyle}
          />
          <main style={mainStyle}>
            <DashHeader
              openSidebar={openSidebar}
              setOpenSidebar={setOpenSidebar}
            />
            <div style={{ height: '100vh' }}>
              <DashLayout openSidebar={openSidebar} />
            </div>
          </main>
        </div>
      ) : (
        <>
          {!hideHeaderFooter && <Header />}
          <main>
            <MainLayout />
          </main>
          {!hideHeaderFooter && <Footer />}
        </>
      )}
    </>
  )
}

export default App
