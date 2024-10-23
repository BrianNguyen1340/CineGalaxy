import { Document, model, Types, Schema } from 'mongoose'

export type PostCommentType = Document & {
  content: string
  postId: Types.ObjectId
  userId: Types.ObjectId
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
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    userId: {
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
