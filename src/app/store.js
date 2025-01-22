import { configureStore } from "@reduxjs/toolkit";
import { postSlice } from "../features/post/postSlice";
import { categotySlice } from "../features/category/categorySlice";
import { authorSlice } from "../features/author/authorSlice";
import { userSlice } from "../features/user/userSlice";
import { notificationSlice } from "../features/notification/notificationSlice";
import { commentSlice } from "../features/comment/commentSlice";

export const store = configureStore({
    reducer: {
        [postSlice.reducerPath]: postSlice.reducer,
        [categotySlice.reducerPath]: categotySlice.reducer,
        [authorSlice.reducerPath]: authorSlice.reducer,
        [userSlice.reducerPath]: userSlice.reducer,
        [notificationSlice.reducerPath]: notificationSlice.reducer,
        [commentSlice.reducerPath]: commentSlice.reducer

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(postSlice.middleware)
            .concat(categotySlice.middleware)
            .concat(authorSlice.middleware)
            .concat(userSlice.middleware)
            .concat(notificationSlice.middleware)
            .concat(commentSlice.middleware)

})

