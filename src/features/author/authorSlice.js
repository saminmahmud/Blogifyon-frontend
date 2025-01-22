import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authorSlice = createApi ({
    reducerPath: 'author',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://blogifyon-backend.onrender.com/author',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            
            if (token) {
              headers.set('Authorization', `Token ${token}`);
            }
      
            return headers;
        }
    }),
    tagTypes: ['authors', 'author'],
    endpoints: (builder) => ({
        
        getAuthorsList: builder.query({
            query: () => '/list/',
            providesTags: ['authors']
        }),

        getAuthorDetails: builder.query({
            query: (id) => `/list/${id}/`,
            providesTags: ['author']
        }),

        updateAuthor: builder.mutation({
            query: ({ id, data }) => ({
                url: `/profile/${id}/`,  
                method: 'PUT',
                body: data,  
            }),
            invalidatesTags: ['authors', 'author'],  
        }),

        searchAuthor: builder.query({
            query: (username) => {
                return {
                    url: `/list/?search=${username}`,
                    method: 'GET',
                };
            },
            invalidatesTags: ['authors', 'author'],
        }),
    })
})

export const { useGetAuthorsListQuery, useGetAuthorDetailsQuery, useUpdateAuthorMutation, useSearchAuthorQuery } = authorSlice;