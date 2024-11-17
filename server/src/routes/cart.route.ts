import { Router } from 'express'

import { authentication } from '~/middlewares/auth.middleware'
import { cartController } from '~/controllers/cart.controller'

const router = Router()

router.post('/add-to-cart', [authentication], cartController.addToCart)
router.get('/', [authentication], cartController.getCartProducts)
router.put('/update-cart/:id', [authentication], cartController.updateQuantity)
router.delete('/', [authentication], cartController.removeAllFromCart)

export const cartRoute = router
