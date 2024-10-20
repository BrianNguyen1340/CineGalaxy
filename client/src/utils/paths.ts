const userPaths = {
  account: '/account',
  login: '/login',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password/:token',
  register: '/register',
  verifyOtp: '/verify-otp',
  cinemas: '/cinemas',
  contact: '/contact',
  coupons: '/coupons',
  giftShop: '/gift-shop',
  home: '/',
  membership: '/membership',
  movieDetails: '/movie/:movieId',
  movieLists: '/movies',
  payments: '/payments',
  pointsHistory: '/point-history',
  profile: '/profile',
  promotions: '/promotions',
  selectSeats: '/select-seats',
  showtimes: '/showtimes',
  support: '/support',
  ticketPurchaseHistory: '/ticket-purchase-history',
  watchedMovies: '/watched-movies',
  notFound: '/not-found',

  // private auth
  privateLogin: '/private-login',
  privateForgotPassword: '/private-forgot-password',
  privateResetPassword: '/private-reset-password',
}

const dashboardPaths = {
  privateProfile: '/private-profile',
  dashboard: '/dashboard',
  managements: {
    accounts: {
      list: '/list-accounts',
      create: '/create-account',
      update: '/update-account/:id',
      delete: '/delete-account/:id',
    },
    genres: {
      list: '/list-genres',
      create: '/create-genre',
      update: '/update-genre/:id',
      delete: '/delete-genre/:id',
    },
    cinemas: {
      list: '/list-cinemas',
      create: '/create-cinema',
      update: '/update-cinema/:id',
      delete: '/delete-cinema/:id',
    },
    cinemaComplexes: {
      list: '/list-cinema-complexes',
      create: '/create-cinema-complex',
      update: '/update-cinema-complex/:id',
      delete: '/delete-cinema-complex/:id',
    },
    invoices: {
      list: '/list-invoices',
      create: '/create-invoice',
      update: '/update-invoice/:id',
      delete: '/delete-invoice/:id',
    },
    movies: {
      list: '/list-movies',
      create: '/create-movie',
      update: '/update-movie/:id',
      delete: '/delete-movie/:id',
    },
    promotions: {
      list: '/list-promotions',
      create: '/create-promotion',
      update: '/update-promotion/:id',
      delete: '/delete-promotion/:id',
    },
    rooms: {
      list: '/list-rooms',
      create: '/create-room',
      update: '/update-room/:id',
      delete: '/delete-room/:id',
    },
    seats: {
      list: '/list-seats',
      create: '/create-seats',
      update: '/update-seats/:id',
      delete: '/delete-seats/:id',
    },
    sellServices: {
      list: '/list-sell-services',
      create: '/create-sell-service',
      update: '/update-sell-service/:id',
      delete: '/delete-sell-service/:id',
    },
    sellTickets: {
      list: '/list-sell-tickets',
      create: '/create-sell-ticket',
      update: '/update-sell-ticket/:id',
      delete: '/delete-sell-ticket/:id',
    },
    showtimes: {
      list: '/list-showtimes',
      create: '/create-showtime',
      update: '/update-showtime/:id',
      delete: '/delete-showtime/:id',
    },
    ticketReports: {
      list: '/list-reports',
      create: '/create-report',
      update: '/update-report/:id',
      delete: '/delete-report/:id',
    },
  },
  statistics: {
    cinemaSales: {},
    customerSales: {},
    movieSales: {},
    serviceSales: {},
    showtimeSales: {},
    ticketSales: {},
  },
}

export const paths = {
  userPaths,
  dashboardPaths,
}
