import React, { use } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router';
import useUserInfo from '../hooks/UseUserInfo';
import Loader from '../components/Loader';

const ManagerRoute = ({ children }) => {

    const { loading, user } = use(AuthContext);

    const { role, isLoading } = useUserInfo();

    if (loading || !user || isLoading) return <Loader></Loader>

    if (role !== 'hr') {
        return <Navigate to='/dashboard/request-asset' replace></Navigate>
    }

    return children
};

export default ManagerRoute;