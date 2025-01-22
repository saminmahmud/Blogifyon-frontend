import React from "react";
import Nav from "../components/Nav";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "../context/AuthContext";
import Footer from "./Footer";

const Root = () => {
    return (
        <div >
            <div>
                <Nav />
                <ToastContainer />
            </div>

            <div className=" px-2 pt-10  md:px-16 lg:px-24 xl:px-40 bg-black text-white">
                <div className=" md:pb-8 w-full md:mx-4 pt-4 border-2 p-3 border-none min-h-screen"> 
                
                    <Outlet />
                </div>
            </div>

            <div>
                <Footer />
            </div>
        </div>
    );
};

export default Root;
