import { Router } from 'express'

import { authentication, isManager } from '~/middlewares/auth.middleware'
import { comboController } from '~/controllers/combo.controller'

const router = Router()

router.post(
  '/create',
  [authentication, isManager],
  comboController.handleCreate,
)
router.get(
  '/get/:id',
  [authentication, isManager],
  comboController.handleGetOne,
)
router.get(
  '/get-all',
  [authentication, isManager],
  comboController.handleGetAll,
)
router.put(
  '/update/:id',
  [authentication, isManager],
  comboController.handleUpdate,
)

export const comboRoute = router
