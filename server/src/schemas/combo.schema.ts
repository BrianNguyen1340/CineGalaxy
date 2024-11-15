import { Document, model, Types, Schema } from 'mongoose'

export type ComboType = Document & {
  readonly _id: Types.ObjectId
}
