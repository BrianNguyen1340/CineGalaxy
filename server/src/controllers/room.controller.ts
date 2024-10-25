import { RequestHandler } from 'express'
import { Types } from 'mongoose'

import { catchErrors } from '~/utils/catchErrors'
import { roomValidation } from '~/validations/room.validation'
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '~/utils/responseDataHandler'
import { handleJoiError } from '~/middlewares/joi.middleware'
import { roomService } from '~/services/room.service'

// *****************************************************************************

const handleCreate = catchErrors(async (req, res) => {})
