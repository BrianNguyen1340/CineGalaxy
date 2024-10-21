import { Router } from 'express'

import { authentication, isAdmin } from '~/middlewares/auth.middleware'
import { genreController } from '~/controllers/genre.controller'

const router = Router()

router.post('/create', [authentication, isAdmin], genreController.handleCreate)
router.get('/get/:id', [authentication, isAdmin], genreController.handleGetOne)
router.get('/get-all', [authentication, isAdmin], genreController.handleGetAll)
router.put(
  '/update/:id',
  [authentication, isAdmin],
  genreController.handleUpdate,
)

export const genreRoute = router
