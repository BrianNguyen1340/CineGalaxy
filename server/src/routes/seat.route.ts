import { Router } from 'express'

import { authentication, isAdmin } from '~/middlewares/auth.middleware'
import { seatController } from '~/controllers/seat.controller'

const router = Router()

router.post('/create', [authentication, isAdmin], seatController.handleCreate)
router.get('/get/:id', seatController.handleGetOne)
router.get('/get-all', seatController.handleGetAll)
router.put(
  '/update/:id',
  [authentication, isAdmin],
  seatController.handleUpdate,
)

export const seatRoute = router
