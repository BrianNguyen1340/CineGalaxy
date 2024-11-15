import { Document, model, Types, Schema } from 'mongoose'

export type PostCommentType = Document & {
  readonly _id: Types.ObjectId
  content: string
  post: Types.ObjectId
  user: Types.ObjectId
  likes: Types.ObjectId[]
  numberOfLikes: number
}

const postCommentSchema = new Schema<PostCommentType>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

export const postCommentModel = model<PostCommentType>(
  'PostComment',
  postCommentSchema,
)
