import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postSlice = createApi({
    reducerPath: 'post',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://blogifyon-backend.onrender.com/post',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');

            if (token) {
              headers.set('Authorization', `Token ${token}`);
            }
      
            return headers;
        }
    }),
    tagTypes:['posts', 'post', 'saved_posts'],
    endpoints: (builder) => ({
        getPostsList: builder.query({
            query: () => '/list/',
            // query: (order="") => `/list/?ordering=${order}`,
            providesTags: ['posts']
        }),

        getPostDetails: builder.query({
            query: (id) => `/list/${id}/`,
            providesTags: ['post']
        }),

        updatePost: builder.mutation({
            query: ({ id, data }) => ({
                url: `/list/${id}/`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['posts', 'post']
        }),

        authorPost: builder.query({
            query: (q) => {
                // console.log("Querying with author:", q.username, "and orderType:", q.ordered); // Debugging
                return {
                    url: `/list/?${q.ordered && `ordering=${q.ordered}&`}search=${q.username}`,
                    method: 'GET',
                };
            },
            invalidatesTags: ['posts', 'post'],
        }),

        getPostLikes: builder.query({
            query: (id) => {
                // console.log("Getting:  ", id)
                return {
                    url: `/likes/?search=${id}`
                }
            },
            invalidatesTags: ['posts', 'post']
        }),

        createLikes: builder.mutation({
            query: (data) => ({
                url: '/likes/',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['posts', 'post']
        }),

        deleteLikes: builder.mutation({
            query: (id) => ({
                url: `/likes/${id}/`,
                method: 'DELETE'
            }),
            invalidatesTags: ['posts', 'post']
        }),

        getSavedPosts: builder.query({
            query: (id) => `saved_post/?search=${id}`,
            providesTags: ['saved_posts']
        }),

        createSavePost: builder.mutation({
            query: (data) => ({
                url: '/saved_post/',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['saved_posts']
        }),

        deleteSavePost: builder.mutation({
            query: (id) => ({
                url: `/saved_post/${id}/`,
                method: 'DELETE'
            }),
            invalidatesTags: ['saved_posts']
        }),

    })
})

export const { 
    useGetPostsListQuery, 
    useGetPostDetailsQuery, 
    useAuthorPostQuery, 
    useUpdatePostMutation, 
    useGetPostLikesQuery, 
    useCreateLikesMutation, 
    useDeleteLikesMutation, 
    useGetSavedPostsQuery,
    useCreateSavePostMutation,
    useDeleteSavePostMutation
} = postSlice;