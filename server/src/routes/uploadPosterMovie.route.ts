// import { Request, Router } from 'express'
// import multer, { FileFilterCallback } from 'multer'
// import path from 'path'

// const router = Router()

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/posters')
//   },

//   filename: (req, file, cb) => {
//     const extname = path.extname(file.originalname)
//     cb(null, `${file.fieldname}-${Date.now()}${extname}`)
//   },
// })

// const fileFilter = (
//   req: Request,
//   file: Express.Multer.File,
//   cb: FileFilterCallback,
// ): void => {
//   const filetypes = /jpe?g|png|webp/
//   const mimetypes = /image\/jpe?g|image\/png|image\/webp/

//   const extname = path.extname(file.originalname).toLowerCase()
//   const mimetype = file.mimetype

//   if (filetypes.test(extname) && mimetypes.test(mimetype)) {
//     cb(null, true)
//   } else {
//     cb(new Error('Images only') as unknown as null, false)
//   }
// }

// const upload = multer({ storage, fileFilter })
// const uploadSingleImage = upload.single('image')

// router.post('/poster', (req, res) => {
//   uploadSingleImage(req, res, (err) => {
//     if (err) {
//       res.status(400).send({ message: err.message })
//     } else if (req.file) {
//       res.status(200).send({
//         message: 'Image uploaded successfully',
//         image: `/${req.file.path}`,
//       })
//     } else {
//       res.status(400).send({ message: 'No image file provided' })
//     }
//   })
// })

// export const uploadPosterMovie = router

import { Request, Router } from 'express'
import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import stream from 'stream'

import cloudinary from '~/configs/cloudinary.config'

const router = Router()
const storage = multer.memoryStorage()

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const filetypes = /jpe?g|png|webp/
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/

  const extname = path.extname(file.originalname).toLowerCase()
  const mimetype = file.mimetype

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Images only') as unknown as null, false)
  }
}

const upload = multer({ storage, fileFilter })
const uploadSingleImage = upload.single('image')

router.post('/poster', (req, res) => {
  uploadSingleImage(req, res, async (err) => {
    if (err) {
      res.status(400).send({ message: err.message })
    } else if (req.file) {
      try {
        const result = await cloudinary.uploader.upload_stream(
          {
            folder: 'posters',
            public_id: `poster-${Date.now()}`,
          },
          (error, result) => {
            if (error) {
              return res
                .status(500)
                .send({ message: 'Upload to Cloudinary failed', error })
            }
            res.status(200).send({
              message: 'Image uploaded successfully',
              image: result?.secure_url,
            })
          },
        )
        const bufferStream = new stream.PassThrough()
        bufferStream.end(req.file.buffer)
        bufferStream.pipe(result)
      } catch (error) {
        res.status(500).send({ message: 'Upload to Cloudinary failed', error })
      }
    } else {
      res.status(400).send({ message: 'No image file provided' })
    }
  })
})

export const uploadPosterMovie = router