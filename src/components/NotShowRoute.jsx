import React, { useContext } from 'react'
import { Navigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';

const NotShowRoute = ({ children }) => {
    const { isLoggedIn } = useContext(AuthContext);


    return !isLoggedIn ? children : <Navigate to="/" />
}

export default NotShowRoute



