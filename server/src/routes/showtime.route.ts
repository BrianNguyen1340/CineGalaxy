import { Router } from 'express'

import { authentication, isManager } from '~/middlewares/auth.middleware'
import { showtimeController } from '~/controllers/showtime.controller'

const router = Router()

router.post(
  '/create',
  [authentication, isManager],
  showtimeController.handleCreate,
)
router.get('/get/:id', showtimeController.handleGetOne)
router.get('/get-all', showtimeController.handleGetAll)
router.put(
  '/update/:id',
  [authentication, isManager],
  showtimeController.handleUpdate,
)

export const showtimeRoute = router
