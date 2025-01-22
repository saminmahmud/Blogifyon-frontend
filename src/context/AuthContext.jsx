import { createContext, useEffect, useState } from "react";
import { isAuthenticated } from "../auth/auth";

export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [isLoggedIn, setIsLoggedIn] = useState( isAuthenticated() );



    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn  }}>
            {children}
        </AuthContext.Provider>
    );

}