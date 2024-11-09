import { Document, model, Types, Schema } from 'mongoose'

export type PostType = Document & {
  readonly _id: Types.ObjectId
  userId: Types.ObjectId
  content: string
  title: string
  slug: string
  image: string
}

const postSchema = new Schema<PostType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
      default:
        'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
    },
  },
  {
    timestamps: true,
  },
)

export const postModel = model<PostType>('Post', postSchema)
