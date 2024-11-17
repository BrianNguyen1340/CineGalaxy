import Redis from 'ioredis'

import { varEnv } from './variableEnv.config'

export const redis = new Redis(varEnv.UPSTASH_REDIS_URL)
