import { Router } from 'express'

import { authentication, isManager } from '~/middlewares/auth.middleware'
import { productController } from '~/controllers/product.controller'

const router = Router()

router.post(
  '/create',
  [authentication, isManager],
  productController.handleCreate,
)
router.get('/get/:id', productController.handleGetOne)
router.get('/get-all', productController.handleGetAll)
router.put(
  '/update/:id',
  [authentication, isManager],
  productController.handleUpdate,
)

export const productRoute = router
