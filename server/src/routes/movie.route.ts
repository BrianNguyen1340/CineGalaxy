import { Router } from 'express'

import { movieController } from '~/controllers/movie.controller'
import { authentication, isAdmin } from '~/middlewares/auth.middleware'

const router = Router()

router.post('/create', [authentication, isAdmin], movieController.handleCreate)
router.get('/get/:id', movieController.handleGetOne)
router.get('/get-all', movieController.handleGetAll)
router.put(
  '/update/:id',
  [authentication, isAdmin],
  movieController.handleUpdate,
)
router.put(
  '/hide/:id',
  [authentication, isAdmin],
  movieController.handleHideMovie,
)
router.put(
  '/show/:id',
  [authentication, isAdmin],
  movieController.handleShowMovie,
)

export const movieRoute = router
