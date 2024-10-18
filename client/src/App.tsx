import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import 'nprogress/nprogress.css'

import {
  DashFooter,
  DashHeader,
  DashLayout,
  Footer,
  Header,
  Loader,
  MainLayout,
  Sidebar,
} from '~/components'
import { getTitleFromPathname } from '~/utils/getTitleFromPathname'
import { paths } from '~/utils/paths'
import { useAppSelector } from '~/hooks/redux'
import { NotFound } from '~/pages'

const App = () => {
  const { user } = useAppSelector((state) => state.user)

  const location = useLocation()

  const [loader, setLoader] = useState(true)
  const [openSidebar, setOpenSidebar] = useState<boolean>(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoader(false)
    }, 1000)
    return () => clearTimeout(timeout)
  }, [])

  const hideHeaderFooterPaths = [
    paths.userPaths.login,
    paths.userPaths.register,
    paths.userPaths.verifyOtp,
    paths.userPaths.forgotPassword,
    paths.dashboardPaths.dashboard,
  ]

  const hideHeaderFooter = hideHeaderFooterPaths.includes(location.pathname)

  useEffect(() => {
    document.title = getTitleFromPathname(location.pathname)
    window.scrollTo(0, 0)
  }, [location])

  const isNotFound = location.pathname === paths.userPaths.notFound
  if (isNotFound) {
    return <NotFound />
  }

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {user?.role === 0 || user?.role === 1 || user?.role === 2 ? (
            <div style={{ display: 'flex', width: '100%' }}>
              <Sidebar
                openSidebar={openSidebar}
                setOpenSidebar={setOpenSidebar}
                style={{
                  width: `${openSidebar ? '288px' : '0'}`,
                  left: `${openSidebar ? '0' : '-100%'}`,
                  border: '1px solid #eee',
                }}
              />
              <main
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'transparent',
                  position: 'relative',
                  width: `${openSidebar ? 'calc(100% - 288px)' : '100%'}`,
                  marginLeft: `${openSidebar ? '304px' : '0'}`,
                }}
              >
                <DashHeader
                  openSidebar={openSidebar}
                  setOpenSidebar={setOpenSidebar}
                />
                <div style={{ height: '100vh' }}>
                  <DashLayout openSidebar={openSidebar} />
                </div>
                <DashFooter openSidebar={openSidebar} />
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
      )}
    </>
  )
}

export default App
