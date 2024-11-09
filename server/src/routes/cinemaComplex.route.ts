import { Router } from 'express'

import { authentication, isAdmin } from '~/middlewares/auth.middleware'
import { cinemaComplexController } from '~/controllers/cinemaComplex.controller'

const router = Router()

router.post(
  '/create',
  [authentication, isAdmin],
  cinemaComplexController.handleCreate,
)
router.get('/get/:id', cinemaComplexController.handleGetOne)
router.get('/get-all', cinemaComplexController.handleGetAll)
router.put(
  '/update/:id',
  [authentication, isAdmin],
  cinemaComplexController.handleUpdate,
)

export const cinemaComplexRoute = router
