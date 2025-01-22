import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const savePostSlice = createApi({
    reducerPath: "savePostApi",
    baseQuery: fetchBaseQuery({ 
        baseUrl: "https://blogifyon-backend.onrender.com/post",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            
            if (token) {
              headers.set('Authorization', `Token ${token}`);
            }
      
            return headers;
        } 
    }),
    endpoints: (builder) => ({
        savePost: builder.mutation({
        query: (post_id) => ({
            url: `/save-post/${post_id}/`,
            method: "POST",
        }),
        }),
    }),
});
