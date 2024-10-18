import { Router } from 'express'

import { authentication, isAdmin } from '~/middlewares/auth.middleware'
import { categoryController } from '~/controllers/category.controller'

const router = Router()

router.post(
    '/create',
    [authentication, isAdmin],
    categoryController.handleCreate,
)
// router.get('/', [authentication, isAdmin], categoryController.h)

export const categoryRoute = router
