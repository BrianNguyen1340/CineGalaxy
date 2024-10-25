import { Document, Schema, Types, model } from 'mongoose'

// *****************************************************************************

export type ShowtimeType = Document & {
  _id: Types.ObjectId
  date: Date
  timeStart: Date
  timeEnd: Date
  cinemaComplexId: Types.ObjectId
  cinemaId: Types.ObjectId
}
