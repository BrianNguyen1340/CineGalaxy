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
router.put(
  '/hide/:id',
  [authentication, isManager],
  showtimeController.handleHideShowtime,
)
router.put(
  '/show/:id',
  [authentication, isManager],
  showtimeController.handleShowShowtime,
)

export const showtimeRoute = router
