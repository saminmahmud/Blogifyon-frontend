import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationSlice = createApi({
  reducerPath: 'notification',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://blogifyon-backend.onrender.com/',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        
        if (token) {
          headers.set('Authorization', `Token ${token}`);
        }
  
        return headers;
    }
  }),
  tagTypes: ['notifications', 'notification'],
  endpoints: (builder) => ({
    getNotificationsList: builder.query({
      query: () => '/notification/',
      providesTags: ['notifications']
    }),

    getNotificationDetails: builder.query({
      query: (id) => `/notification/${id}/`,
      providesTags: ['notification']
    }),

    createNotification: builder.mutation({
      query: (newNotification) => ({
        url: '/notification/',
        method: 'POST',
        body: newNotification
      }),
      invalidatesTags: ['notifications']
    }),

    updateNotification: builder.mutation({
      query: ({ id, data }) => ({
        url: `/notification/${id}/`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['notifications', 'notification']
    }),

    searchNotification: builder.query({
      query: (id) => {
        // console.log("Querying with id:", id); // Debugging
        return {
          url: `/notification/?search=${id}`,
          method: 'GET',
        };
      },
      invalidatesTags: ['notifications', 'notification'],
    }),
  }),
});

export const { useGetNotificationsListQuery, useGetNotificationDetailsQuery, useCreateNotificationMutation, useUpdateNotificationMutation, useSearchNotificationQuery } = notificationSlice;