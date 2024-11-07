import { useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'nprogress/nprogress.css'
import 'react-circular-progressbar/dist/styles.css'
import 'react-day-picker/style.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-toastify/dist/ReactToastify.css'

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
      paths.userPaths.resetPassword,
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

  if (isNotFound) {
    return <NotFound />
  }

  return (
    <>
      {user?.role === 0 || user?.role === 1 || user?.role === 2 ? (
        <div className='flex w-full'>
          <Sidebar
            openSidebar={openSidebar}
            setOpenSidebar={setOpenSidebar}
            style={{ width: `${openSidebar ? '288px' : '0'}` }}
          />
          <main
            className='relative flex flex-col bg-transparent'
            style={{
              width: `${openSidebar ? 'calc(100% - 288px)' : '100%'}`,
              marginLeft: `${openSidebar ? '304px' : '0'}`,
            }}
          >
            <DashHeader
              openSidebar={openSidebar}
              setOpenSidebar={setOpenSidebar}
            />
            <div className='mt-4 h-screen'>
              <DashLayout openSidebar={openSidebar} />
            </div>
          </main>
        </div>
      ) : (
        <>
          {!hideHeaderFooter && <Header />}
          <main>
            <MainLayout />
            <ToastContainer />
          </main>
          {!hideHeaderFooter && <Footer />}
        </>
      )}
    </>
  )
}

export default App
