import { Application, Router } from 'express'

import { authRoute } from './auth.route'
import { userRouter } from './user.route'
import { cinemaComplexRoute } from './cinemaComplex.route'
import { cinemaRoute } from './cinema.route'
import { genreRoute } from './genre.route'
import { movieRoute } from './movie.route'
import { roomRoute } from './room.route'
import { seatRoute } from './seat.route'
import { showtimeRoute } from './showtime.route'
import { productCategoryRoute } from './productCategory.route'
import { productRoute } from './product.route'

const router = Router()

export const initAPIRoutes = (app: Application) => {
  router.use('/auth', authRoute)
  router.use('/user', userRouter)
  router.use('/cinema-complex', cinemaComplexRoute)
  router.use('/cinema', cinemaRoute)
  router.use('/genre', genreRoute)
  router.use('/movie', movieRoute)
  router.use('/room', roomRoute)
  router.use('/seat', seatRoute)
  router.use('/showtime', showtimeRoute)
  router.use('/product-category', productCategoryRoute)
  router.use('/product', productRoute)

  return app.use('/api/v1', router)
}
