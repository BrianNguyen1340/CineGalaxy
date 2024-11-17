import { v2 as cloudinary } from 'cloudinary'

import { varEnv } from './variableEnv.config'

cloudinary.config({
  cloud_name: varEnv.CLOUDINARY_NAME,
  api_key: varEnv.CLOUDINARY_API_KEY,
  api_secret: varEnv.CLOUDINARY_SECRET_KEY,
})

export default cloudinary
