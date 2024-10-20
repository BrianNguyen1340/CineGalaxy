// user pages
import Account from './UserInterface/Account/Account'
import Login from './UserInterface/Auth/Login/Login'
import ForgotPassword from './UserInterface/Auth/Login/ForgotPassword/ForgotPassword'
import ResetPassword from './UserInterface/Auth/Login/ResetPassword/ResetPassword'
import Register from './UserInterface/Auth/Register/Register'
import VerifyOTP from './UserInterface/Auth/Register/VerifyOTP/VerifyOTP'
import Cinemas from './UserInterface/Cinemas/Cinemas'
import Contact from './UserInterface/Contact/Contact'
import Coupons from './UserInterface/Coupons/Coupons'
import GiftShop from './UserInterface/GiftShop/GiftShop'
import Home from './UserInterface/Home/Home'
import Membership from './UserInterface/Membership/Membership'
import MovieDetails from './UserInterface/MovieDetails/MovieDetails'
import MovieLists from './UserInterface/MovieLists/MovieLists'
import Payments from './UserInterface/Payments/Payments'
import PointsHitory from './UserInterface/PointsHistory/PointsHitory'
import Profile from './UserInterface/Profile/Profile'
import Promotions from './UserInterface/Promotions/Promotions'
import SelectSeats from './UserInterface/SelectSeats/SelectSeats'
import Showtimes from './UserInterface/Showtimes/Showtimes'
import Support from './UserInterface/Support/Support'
import TicketPurchaseHistory from './UserInterface/TicketPurchaseHistory/TicketPurchaseHistory'
import WatchedMovies from './UserInterface/WatchedMovies/WatchedMovies'
import NotFound from './NotFound/NotFound'

// private auth
import PrivateLogin from './Dashboard/PrivateAuth/PrivateLogin/PrivateLogin'
import PrivateForgotPassword from './Dashboard/PrivateAuth/PrivateLogin/PrivateForgotPassword/PrivateForgotPassword'
import PrivateResetPassword from './Dashboard/PrivateAuth/PrivateLogin/PrivateResetPassword/PrivateResetPassword'

// protected pages
import Doashboard from './Dashboard/Doashboard'

// admin
import ListAccount from './Dashboard/Managements/Accounts/ListAccount/ListAccount'
import CreateAccount from './Dashboard/Managements/Accounts/CreateAccount/CreateAccount'
import UpdateAccount from './Dashboard/Managements/Accounts/UpdateAccount/UpdateAccount'
import ListCinema from './Dashboard/Managements/Cinemas/ListCinema/ListCinema'
import CreateCinema from './Dashboard/Managements/Cinemas/CreateCinema/CreateCinema'
import UpdateCinema from './Dashboard/Managements/Cinemas/UpdateCinema/UpdateCinema'
import ListCinemaComplex from './Dashboard/Managements/CinemaComplex/ListCinemaComplex/ListCinemaComplex'
import CreateCinemaComplex from './Dashboard/Managements/CinemaComplex/CreateCinemaComplex/CreateCinemaComplex'
import UpdateCinemaComplex from './Dashboard/Managements/CinemaComplex/UpdateCinemaComplex/UpdateCinemaComplex'
import ListMovie from './Dashboard/Managements/Movies/ListMovie/ListMovie'
import CreateMovie from './Dashboard/Managements/Movies/CreateMovie/CreateMovie'
import UpdateMovie from './Dashboard/Managements/Movies/UpdateMovie/UpdateMovie'
import ListRoom from './Dashboard/Managements/Rooms/ListRoom/ListRoom'
import CreateRoom from './Dashboard/Managements/Rooms/CreateRoom/CreateRoom'
import UpdateRoom from './Dashboard/Managements/Rooms/UpdateRoom/UpdateRoom'
import ListSeat from './Dashboard/Managements/Seats/ListSeat/ListSeat'
import CreateSeat from './Dashboard/Managements/Seats/CreateSeat/CreateSeat'
import UpdateSeat from './Dashboard/Managements/Seats/UpdateSeat/UpdateSeat'
import ListMovieCategory from './Dashboard/Managements/MovieCategory/ListMovieCategory/ListMovieCategory'
import CreateMovieCategory from './Dashboard/Managements/MovieCategory/CreateMovieCategory/CreateMovieCategory'
import UpdateMovieCategory from './Dashboard/Managements/MovieCategory/UpdateMovieCategory/UpdateMovieCategory'

// manager
import ListShowtime from './Dashboard/Managements/Showtimes/ListShowtime/ListShowtime'
import CreateShowtime from './Dashboard/Managements/Showtimes/CreateShowtime/CreateShowtime'
import UpdateShowtime from './Dashboard/Managements/Showtimes/UpdateShowtime/UpdateShowtime'
import ListPromotion from './Dashboard/Managements/Promotions/ListPromotion/ListPromotion'
import CreatePromotion from './Dashboard/Managements/Promotions/CreatePromotion/CreatePromotion'
import UpdatePromotion from './Dashboard/Managements/Promotions/UpdatePromotion/UpdatePromotion'
import ListSellService from './Dashboard/Managements/SellService/ListSellService/ListSellService'
import CreateSellService from './Dashboard/Managements/SellService/CreateSellService/CreateSellService'
import UpdateSellService from './Dashboard/Managements/SellService/UpdateSellService/UpdateSellService'
import ListTicketReport from './Dashboard/Managements/TicketReport/ListTicketReport/ListTicketReport'
import CreateTicketReport from './Dashboard/Managements/TicketReport/CreateTicketReport/CreateTicketReport'
import UpdateTicketReport from './Dashboard/Managements/TicketReport/UpdateTicketReport/UpdateTicketReport'
import ListInvoice from './Dashboard/Managements/Invoices/ListInvoice/ListInvoice'
import CreateInvoice from './Dashboard/Managements/Invoices/CreateInvoice/CreateInvoice'
import UpdateInvoice from './Dashboard/Managements/Invoices/UpdateInvoice/UpdateInvoice'

// manager

// cashier

export {
  // not found
  NotFound,

  // user pages
  Account,
  Login,
  ForgotPassword,
  ResetPassword,
  Register,
  VerifyOTP,
  Cinemas,
  Contact,
  Coupons,
  GiftShop,
  Home,
  Membership,
  MovieDetails,
  MovieLists,
  Payments,
  PointsHitory,
  Profile,
  Promotions,
  SelectSeats,
  Showtimes,
  Support,
  TicketPurchaseHistory,
  WatchedMovies,

  // private auth
  PrivateLogin,
  PrivateForgotPassword,
  PrivateResetPassword,

  // protected pages
  Doashboard,

  // admin
  ListAccount,
  CreateAccount,
  UpdateAccount,
  ListCinema,
  CreateCinema,
  UpdateCinema,
  ListCinemaComplex,
  CreateCinemaComplex,
  UpdateCinemaComplex,
  ListRoom,
  CreateRoom,
  UpdateRoom,
  ListMovie,
  CreateMovie,
  UpdateMovie,
  ListSeat,
  CreateSeat,
  UpdateSeat,
  ListMovieCategory,
  CreateMovieCategory,
  UpdateMovieCategory,

  // manager
  ListShowtime,
  CreateShowtime,
  UpdateShowtime,
  ListPromotion,
  CreatePromotion,
  UpdatePromotion,
  ListInvoice,
  CreateInvoice,
  UpdateInvoice,
  ListSellService,
  CreateSellService,
  UpdateSellService,
  ListTicketReport,
  CreateTicketReport,
  UpdateTicketReport,

  // cashier
}
