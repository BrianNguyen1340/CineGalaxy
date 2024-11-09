import { Router } from 'express'

import { roomController } from '~/controllers/room.controller'
import { authentication, isAdmin } from '~/middlewares/auth.middleware'

const router = Router()

router.post('/create', [authentication, isAdmin], roomController.handleCreate)
router.get('/get/:id', roomController.handleGetOne)
router.get('/get-all', roomController.handleGetAll)
router.put(
  '/update/:id',
  [authentication, isAdmin],
  roomController.handleUpdate,
)

export const roomRoute = router
