import { Router } from 'express'

import { authentication, isAdmin } from '~/middlewares/auth.middleware'
import { categoryController } from '~/controllers/category.controller'

const router = Router()

router.post(
    '/create',
    [authentication, isAdmin],
    categoryController.handleCreate,
)
router.get(
    '/get/:id',
    [authentication, isAdmin],
    categoryController.handleGetOne,
)
router.get(
    '/get-all',
    [authentication, isAdmin],
    categoryController.handleGetAll,
)
router.put('/update/:id', [authentication, isAdmin], categoryController.handleUpdate)

export const categoryRoute = router
