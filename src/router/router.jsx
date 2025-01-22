import React from "react";
import { createBrowserRouter } from "react-router";
import Root from "../pages/Root";
import Home from "../pages/Home";
import About from "../pages/About";
import PostDetails from "../pages/PostDetails";
import Login from "../pages/Login";
import Registration from "../pages/Registration";
import AddPost from "../pages/AddPost";
import PrivateRoute from "../components/PrivateRoute";
import NotShowRoute from "../components/NotShowRoute";
import Profile from "../pages/Profile";
import SearchResult from "../pages/SearchResult";
import PageNotFound from "../pages/PageNotFound";
import PostSaved from "../pages/PostSaved";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/about", element: <About /> },
            { path: "/add-post", element: <PrivateRoute> <AddPost /> </PrivateRoute>  },
            { path: "/post/details/:id", element: <PrivateRoute> <PostDetails /> </PrivateRoute>},
            { path: "/user/:id", element: <PrivateRoute> <Profile /> </PrivateRoute>},
            { path: "/search", element: <PrivateRoute> <SearchResult /> </PrivateRoute>},
            { path: "/saved-post", element: <PrivateRoute> <PostSaved /> </PrivateRoute>},
            
            { path: "/login", element: <NotShowRoute><Login /> </NotShowRoute> },
            { path: "/register", element: <NotShowRoute><Registration /> </NotShowRoute> },

            { path: "*", element: <PageNotFound /> }
        ],
    },
]);
