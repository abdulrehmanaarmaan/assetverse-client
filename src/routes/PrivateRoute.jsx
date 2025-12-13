import React, { use } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router';
import Loader from '../components/Loader';

const PrivateRoute = ({ children }) => {

    const { loading, user } = use(AuthContext);

    const location = useLocation();

    if (loading) return <Loader></Loader>

    if (!user) {
        return <Navigate state={location?.pathname} to='/login'></Navigate>
    }

    return children
};

export default PrivateRoute;