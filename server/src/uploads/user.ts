import { Request, Router } from 'express'
import multer, { FileFilterCallback } from 'multer'
import path from 'path'

const router = Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/user')
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname)
        cb(null, `${file.fieldname}-${Date.now()}${extname}`)
    },
})

const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
) => {
    const filetypes = /jpe?g|png|webp/ //
    const mimetypes = /image\/jpe?g|image\/png|image\/webp/

    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase(),
    )
    const mimetype = mimetypes.test(file.mimetype)

    if (extname && mimetype) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
})

const uploadSingleImage = upload.single('image')

router.post('/', (req, res) => {
    uploadSingleImage(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            res.status(400).send({ message: `Multer error: ${err.message}` })
        } else if (err) {
            res.status(500).send({ message: `Server error: ${err.message}` })
        } else if (!req.file) {
            res.status(400).send({ message: 'No image file provided!' })
        } else {
            res.status(200).send({
                message: 'Image uploaded successfully!',
                image: `/uploads/user/${req.file.filename}`,
            })
        }
    })
})

export const userUpload = router
