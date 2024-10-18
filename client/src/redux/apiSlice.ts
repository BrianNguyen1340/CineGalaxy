import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { baseUrl } from '~/utils/urls';

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl,
    }),
    endpoints: () => ({}),
});
