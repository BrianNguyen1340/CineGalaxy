import { apiSlice } from '~/redux/apiSlice'

export const productCategoryAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProductCategory: builder.mutation({
      query: (data) => ({
        url: `/api/v1/product-category/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getProductCategory: builder.query({
      query: (id) => ({
        url: `/api/v1/product-category/get/${id}`,
      }),
    }),
    getProductCategories: builder.query({
      query: () => ({
        url: `/api/v1/product-category/get-all`,
      }),
    }),
    updateProductCategory: builder.mutation({
      query: (data) => ({
        url: `/api/v1/product-category/update/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
})

export const {
  useCreateProductCategoryMutation,
  useGetProductCategoriesQuery,
  useGetProductCategoryQuery,
  useUpdateProductCategoryMutation,
} = productCategoryAPISlice
