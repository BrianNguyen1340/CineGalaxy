import { Router } from 'express'

import { authentication, isAdmin } from '~/middlewares/auth.middleware'
import { cinemaController } from '~/controllers/cinema.controller'

const router = Router()

router.post('/create', [authentication, isAdmin], cinemaController.handleCreate)
router.get('/get/:id', cinemaController.handleGetOne)
router.get('/get-all', cinemaController.handleGetAll)
router.put(
  '/update/:id',
  [authentication, isAdmin],
  cinemaController.handleUpdate,
)

export const cinemaRoute = router
