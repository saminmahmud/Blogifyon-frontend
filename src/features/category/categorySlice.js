import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categotySlice = createApi({
    reducerPath: "category",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://blogifyon-backend.onrender.com/",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            
            if (token) {
              headers.set('Authorization', `Token ${token}`);
            }
      
            return headers;
        }
    }),
    tagTypes: ["categories", "category"],
    endpoints: (builder) => ({
        getCategoryList: builder.query({
            query: () => "/category/",
            providesTags: ["categories"],
        }),

        getCategory: builder.query({
            query: (id) => `/category/${id}/`,
            providesTags: ["category"],
        }),

        createCategory: builder.mutation({
            query: (data) => ({
                url: "/category/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["categories"],
        }),
    }),
});

export const {
    useGetCategoryListQuery,
    useGetCategoryQuery,
    useCreateCategoryMutation,
} = categotySlice;
