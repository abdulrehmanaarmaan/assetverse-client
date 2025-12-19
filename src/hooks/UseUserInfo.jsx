import { useQuery } from '@tanstack/react-query';
import React, { use } from 'react';
import { AuthContext } from '../contexts/AuthContext';
// import useAxios from './UseAxios';
import useAxiosSecure from './UseAxiosSecure';

const useUserInfo = () => {

    const axiosInstanceSecure = useAxiosSecure();

    const { user } = use(AuthContext);

    console.log(user)

    const { data: currentUser, isLoading, refetch } = useQuery({
        queryKey: ['users', user?.email],
        // enabled: !!user?.email,
        queryFn: async () => {
            const result = await axiosInstanceSecure.get(`/users?email=${user?.email}`)
            // console.log(result, user?.email)
            return result?.data
        }
    })

    return { ...currentUser, isLoading, refetch }
};

export default useUserInfo;