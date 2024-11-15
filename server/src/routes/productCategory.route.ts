import { Router } from 'express'

import { authentication, isManager } from '~/middlewares/auth.middleware'
import { productCategoryController } from '~/controllers/productCategory.controller'

const router = Router()

router.post(
  '/create',
  [authentication, isManager],
  productCategoryController.handleCreate,
)
router.get('/get/:id', productCategoryController.handleGetOne)
router.get('/get-all', productCategoryController.handleGetAll)
router.put(
  '/update/:id',
  [authentication, isManager],
  productCategoryController.handleUpdate,
)

export const productCategoryRoute = router
