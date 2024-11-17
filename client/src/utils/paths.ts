const userPaths = {
  // *** PUBLIC PATHS
  home: '/',
  account: '/account',
  login: '/login',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password/:token',
  register: '/register',
  verifyOtp: '/verify-otp',
  cinemas: '/cinemas',
  contact: '/contact',
  giftShop: '/gift-shop',
  movieDetails: '/movie/:id',
  movieLists: '/movies',
  promotions: '/promotions',
  showtimes: '/showtimes',
  support: '/support',
  showtimeDetails: '/showtime/:id',

  // *** PRIVATE PATHS
  profile: '/profile',
  payments: '/payments',
  coupons: '/coupons',
  pointsHistory: '/point-history',
  ticketPurchaseHistory: '/ticket-purchase-history',
  watchedMovies: '/watched-movies',
  membership: '/membership',

  // *** NOTFOUND PATH
  notFound: '/not-found',

  // *** PRIVATE AUTH PATHS
  privateLogin: '/private-login',
  privateForgotPassword: '/private-forgot-password',
  privateResetPassword: '/private-reset-password/:token',
}

const dashboardPaths = {
  privateProfile: '/private-profile',
  dashboard: '/dashboard',
  managements: {
    // *** ADMIN PATHS
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
    movies: {
      list: '/list-movies',
      create: '/create-movie',
      update: '/update-movie/:id',
      delete: '/delete-movie/:id',
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
      update: '/update-seat/:id',
      delete: '/delete-seat/:id',
    },

    // *** MANAGER PATHS
    promotions: {
      list: '/list-promotions',
      create: '/create-promotion',
      update: '/update-promotion/:id',
      delete: '/delete-promotion/:id',
    },
    showtimes: {
      list: '/list-showtimes',
      create: '/create-showtime',
      update: '/update-showtime/:id',
      delete: '/delete-showtime/:id',
    },
    productCategories: {
      list: '/list-product-categories',
      create: '/create-product-category',
      update: '/update-product-category/:id',
      delete: '/delete-product-category/:id',
    },
    products: {
      list: '/list-products',
      create: '/create-product',
      update: '/update-product/:id',
      delete: '/delete-product/:id',
    },
    combos: {
      list: '/list-combos',
      create: '/create-combo',
      update: '/update-combo/:id',
      delete: '/delete-combo/:id',
    },

    // *** CASHIER PATHS
    ticketReports: {
      list: '/list-reports',
      create: '/create-report',
      update: '/update-report/:id',
      delete: '/delete-report/:id',
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
    invoices: {
      list: '/list-invoices',
      create: '/create-invoice',
      update: '/update-invoice/:id',
      delete: '/delete-invoice/:id',
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
