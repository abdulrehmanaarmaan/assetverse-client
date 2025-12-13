import React, { use } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Loader from '../components/Loader';
import { Navigate } from 'react-router';
import useUserInfo from '../hooks/UseUserInfo';

const EmployeeRoute = ({ children }) => {

    const { loading, user } = use(AuthContext);

    const { role, isLoading } = useUserInfo();
    console.log(role)

    if (loading || !user || isLoading) return <Loader></Loader>

    if (role !== 'employee') {
        return <Navigate to='/dashboard/asset-list' replace></Navigate>
    }

    return children
};

export default EmployeeRoute;