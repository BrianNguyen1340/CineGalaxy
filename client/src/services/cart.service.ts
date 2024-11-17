import { apiSlice } from '~/redux/apiSlice'

export const cartAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addToCart: builder.mutation({
      query: (data) => ({
        url: `/api/v1/cart/add-to-cart`,
        method: 'POST',
        body: data,
      }),
    }),
    getCart: builder.query({
      query: (id) => ({
        url: `/api/v1/cart/${id}`,
      }),
    }),
    updateCartQuantity: builder.mutation({
      query: (data) => ({
        url: `/api/v1/cart/update-cart/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    removeAllFromCart: builder.mutation({
      query: () => ({
        url: '/api/v1/cart',
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useAddToCartMutation,
  useGetCartQuery,
  useUpdateCartQuantityMutation,
  useRemoveAllFromCartMutation,
} = cartAPISlice
