import { ProductCategoryType } from './productCategory.type'

export type ProductType = {
  readonly _id: string
  name: string
  category: ProductCategoryType
  price: number
  size: string
  image: string
  description?: string
}
