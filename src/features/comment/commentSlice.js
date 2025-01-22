import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const commentSlice = createApi({
    reducerPath: "commentApi",
    baseQuery: fetchBaseQuery({ 
        baseUrl: "https://blogifyon-backend.onrender.com/comment-reply",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            
            if (token) {
              headers.set('Authorization', `Token ${token}`);
            }
      
            return headers;
        }

    }),
    tagTypes: ['comments'],
    endpoints: (builder) => ({
        
        getComments: builder.query({
            query: (id) => `/post/${id}/`,
            providesTags: ['comments'],
        }),
        
        addComment: builder.mutation({
            query: (data) => ({
                url: `/comment/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['comments'],
        }),
        
        addReply: builder.mutation({
            query: (data) => ({
                url: `/reply/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['comments'],
        }),

        getAllComments: builder.query({
            query: () => `/comment/`,
            invalidatesTags: ['comments'],
        }),

        getAllReplies: builder.query({
            query: () => `/reply/`,
            invalidatesTags: ['comments'],
        }),

    }),
})

export const {
    useGetCommentsQuery,
    useAddCommentMutation,
    useAddReplyMutation,
    useGetAllCommentsQuery,
    useGetAllRepliesQuery,
} = commentSlice;