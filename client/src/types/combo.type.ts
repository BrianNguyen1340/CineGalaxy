import { ProductType } from "./product.type"

export type ComboType = {
  readonly _id: string
  name: string
  expiry: number
  products: ProductType[]
  image: string
}
