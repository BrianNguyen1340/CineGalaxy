import Stripe from 'stripe'

import { varEnv } from './variableEnv.config'

export const stripe = new Stripe(varEnv.STRIPE_SECRET_KEYS)
