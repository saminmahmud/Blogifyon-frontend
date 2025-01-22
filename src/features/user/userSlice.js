import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userSlice = createApi({
    reducerPath: "user",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://blogifyon-backend.onrender.com/accounts",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            
            if (token) {
              headers.set('Authorization', `Token ${token}`);
            }
      
            return headers;
        }
    }),
    tagTypes: ["users", "user"],
    endpoints: (builder) => ({
        getUsersList: builder.query({
            query: () => "/list/",
            providesTags: ["users"],
        }),
        getUserDetails: builder.query({
            query: (id) => `/list/${id}/`,
            providesTags: ["user"],
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: "/register/",
                method: "POST",
                body: userData,
            }),
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: "/login/",
                method: "POST",
                body: credentials,
            }),
        }),
        
        logout: builder.mutation({
            query: () => ({
                url: "/logout/",
                method: "POST",
                headers: {
                    Authorization: `Token ${localStorage.getItem("token")}`, 
                },
            }),
        }),
    }),
});

export const {
    useGetUsersListQuery,
    useGetUserDetailsQuery,
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
} = userSlice;
