import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { persistor, store } from '~/redux/store.ts'
import { paths } from '~/utils/paths.ts'
import {
  // user
  Account,
  Cinemas,
  Contact,
  Coupons,
  ForgotPassword,
  GiftShop,
  Home,
  Login,
  Membership,
  MovieDetails,
  MovieLists,
  Payments,
  PointsHitory,
  Profile,
  Promotions,
  Register,
  ResetPassword,
  SelectSeats,
  Showtimes,
  Support,
  TicketPurchaseHistory,
  VerifyOTP,
  WatchedMovies,

  // private auth
  PrivateLogin,
  PrivateForgotPassword,
  PrivateResetPassword,

  // dashboard
  Doashboard,
  NotFound,
  ListAccount,
  CreateAccount,
  UpdateAccount,
  ListCinema,
  CreateCinema,
  UpdateCinema,
  ListMovie,
  CreateMovie,
  UpdateMovie,
  ListRoom,
  CreateRoom,
  UpdateRoom,
  ListSeat,
  CreateSeat,
  UpdateSeat,
  ListShowtime,
  CreateShowtime,
  UpdateShowtime,
  ListInvoice,
  CreateInvoice,
  UpdateInvoice,
  ListPromotion,
  CreatePromotion,
  UpdatePromotion,
  ListSellService,
  CreateSellService,
  ListCinemaComplex,
  CreateCinemaComplex,
  UpdateCinemaComplex,
  ListGenre,
  CreateGenre,
  UpdateGenre,
} from '~/pages'
import App from './App.tsx'
import RequiredAuth from '~/routes/RequiredAuth'
import AdminRoute from '~/routes/AdminRoute'
import './index.scss'
import ManagerRoute from './routes/ManagerRoute.tsx'
import CashierRoute from './routes/CashierRoute.tsx'
import PrivateProfile from './pages/Dashboard/PrivateProfile/PrivateProfile.tsx'

// *****************************************************************************

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />}>
            {/* PUBLIC ROUTES */}
            <Route index path='/' element={<Home />} />
            <Route path={paths.userPaths.register} element={<Register />} />
            <Route path={paths.userPaths.verifyOtp} element={<VerifyOTP />} />
            <Route path={paths.userPaths.login} element={<Login />} />
            <Route
              path={paths.userPaths.forgotPassword}
              element={<ForgotPassword />}
            />
            <Route
              path={paths.userPaths.resetPassword}
              element={<ResetPassword />}
            />
            <Route path={paths.userPaths.cinemas} element={<Cinemas />} />
            <Route path={paths.userPaths.showtimes} element={<Showtimes />} />
            <Route path={paths.userPaths.contact} element={<Contact />} />
            <Route path={paths.userPaths.promotions} element={<Promotions />} />
            <Route path={paths.userPaths.support} element={<Support />} />
            <Route path={paths.userPaths.movieLists} element={<MovieLists />} />
            <Route
              path={paths.userPaths.movieDetails}
              element={<MovieDetails />}
            />
            <Route path={paths.userPaths.giftShop} element={<GiftShop />} />

            {/* private auth */}
            <Route
              path={paths.userPaths.privateLogin}
              element={<PrivateLogin />}
            />
            <Route
              path={paths.userPaths.privateForgotPassword}
              element={<PrivateForgotPassword />}
            />
            <Route
              path={paths.userPaths.privateResetPassword}
              element={<PrivateResetPassword />}
            />
            {/* REQUIRED AUTH ROUTES */}
            <Route element={<RequiredAuth />}>
              <Route path={paths.userPaths.coupons} element={<Coupons />} />
              <Route
                path={paths.userPaths.membership}
                element={<Membership />}
              />
              <Route path={paths.userPaths.account} element={<Account />} />
              <Route path={paths.userPaths.profile} element={<Profile />} />
              <Route
                path={paths.userPaths.pointsHistory}
                element={<PointsHitory />}
              />
              <Route path={paths.userPaths.payments} element={<Payments />} />
              <Route
                path={paths.userPaths.watchedMovies}
                element={<WatchedMovies />}
              />
              <Route
                path={paths.userPaths.selectSeats}
                element={<SelectSeats />}
              />
              <Route
                path={paths.userPaths.ticketPurchaseHistory}
                element={<TicketPurchaseHistory />}
              />
            </Route>
            {/* ADMIN ROUTES */}
            <Route element={<AdminRoute />}>
              <Route
                index
                path={paths.dashboardPaths.dashboard}
                element={<Doashboard />}
              />
              <Route
                path={paths.dashboardPaths.privateProfile}
                element={<PrivateProfile />}
              />
              <Route
                path={paths.dashboardPaths.managements.accounts.list}
                element={<ListAccount />}
              />
              <Route
                path={paths.dashboardPaths.managements.accounts.create}
                element={<CreateAccount />}
              />
              <Route
                path={paths.dashboardPaths.managements.accounts.update}
                element={<UpdateAccount />}
              />
              <Route
                path={paths.dashboardPaths.managements.cinemaComplexes.list}
                element={<ListCinemaComplex />}
              />
              <Route
                path={paths.dashboardPaths.managements.cinemaComplexes.create}
                element={<CreateCinemaComplex />}
              />
              <Route
                path={paths.dashboardPaths.managements.cinemaComplexes.update}
                element={<UpdateCinemaComplex />}
              />
              <Route
                path={paths.dashboardPaths.managements.cinemas.list}
                element={<ListCinema />}
              />
              <Route
                path={paths.dashboardPaths.managements.cinemas.create}
                element={<CreateCinema />}
              />
              <Route
                path={paths.dashboardPaths.managements.cinemas.update}
                element={<UpdateCinema />}
              />
              <Route
                path={paths.dashboardPaths.managements.genres.list}
                element={<ListGenre />}
              />
              <Route
                path={paths.dashboardPaths.managements.genres.create}
                element={<CreateGenre />}
              />
              <Route
                path={paths.dashboardPaths.managements.genres.update}
                element={<UpdateGenre />}
              />
              <Route
                path={paths.dashboardPaths.managements.movies.list}
                element={<ListMovie />}
              />
              <Route
                path={paths.dashboardPaths.managements.movies.create}
                element={<CreateMovie />}
              />
              <Route
                path={paths.dashboardPaths.managements.cinemas.update}
                element={<UpdateMovie />}
              />
              <Route
                path={paths.dashboardPaths.managements.rooms.list}
                element={<ListRoom />}
              />
              <Route
                path={paths.dashboardPaths.managements.rooms.list}
                element={<CreateRoom />}
              />
              <Route
                path={paths.dashboardPaths.managements.rooms.create}
                element={<UpdateRoom />}
              />
              <Route
                path={paths.dashboardPaths.managements.seats.list}
                element={<ListSeat />}
              />
              <Route
                path={paths.dashboardPaths.managements.seats.create}
                element={<CreateSeat />}
              />
              <Route
                path={paths.dashboardPaths.managements.seats.update}
                element={<UpdateSeat />}
              />
            </Route>
            <Route element={<ManagerRoute />}>
              <Route
                index
                path={paths.dashboardPaths.dashboard}
                element={<Doashboard />}
              />
              <Route
                path={paths.dashboardPaths.privateProfile}
                element={<PrivateProfile />}
              />
              <Route
                path={paths.dashboardPaths.managements.showtimes.list}
                element={<ListShowtime />}
              />
              <Route
                path={paths.dashboardPaths.managements.showtimes.create}
                element={<CreateShowtime />}
              />
              <Route
                path={paths.dashboardPaths.managements.showtimes.update}
                element={<UpdateShowtime />}
              />
              <Route
                path={paths.dashboardPaths.managements.invoices.list}
                element={<ListInvoice />}
              />
              <Route
                path={paths.dashboardPaths.managements.invoices.create}
                element={<CreateInvoice />}
              />
              <Route
                path={paths.dashboardPaths.managements.invoices.update}
                element={<UpdateInvoice />}
              />
              <Route
                path={paths.dashboardPaths.managements.promotions.list}
                element={<ListPromotion />}
              />
              <Route
                path={paths.dashboardPaths.managements.promotions.create}
                element={<CreatePromotion />}
              />
              <Route
                path={paths.dashboardPaths.managements.promotions.update}
                element={<UpdatePromotion />}
              />
            </Route>
            <Route element={<CashierRoute />}>
              <Route
                index
                path={paths.dashboardPaths.dashboard}
                element={<Doashboard />}
              />
              <Route
                path={paths.dashboardPaths.privateProfile}
                element={<PrivateProfile />}
              />
              <Route
                path={paths.dashboardPaths.managements.sellServices.list}
                element={<ListSellService />}
              />
              <Route
                path={paths.dashboardPaths.managements.sellServices.create}
                element={<CreateSellService />}
              />
            </Route>
            <Route
              path='*'
              element={<Navigate to={paths.userPaths.notFound} replace />}
            />
            <Route path={paths.userPaths.notFound} element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
)
