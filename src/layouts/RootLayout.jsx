import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet, useLocation } from 'react-router';
import Footer from '../components/Footer';
import { Toaster } from 'react-hot-toast';

const RootLayout = () => {

    const location = useLocation()

    console.log(location)

    return (
        <div>
            <Navbar></Navbar>

            <div className={`${location?.pathname === '/' ? 'pt-12' : 'py-12'} bg-linear-to-b from-gray-50 to-gray-200 min-h-screen`}>
                <Outlet></Outlet>
            </div>

            <Footer></Footer>
            <Toaster></Toaster>
        </div>
    );
};

export default RootLayout;