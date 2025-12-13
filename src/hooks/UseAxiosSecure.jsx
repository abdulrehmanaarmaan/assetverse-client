import axios from 'axios';
import React, { use, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';

const axiosInstanceSecure = axios.create({
    baseURL: 'http://localhost:5550'
})

const useAxiosSecure = () => {

    const { logout, user } = use(AuthContext)
    const navigate = useNavigate();

    console.log(user?.accessToken)

    useEffect(() => {
        const reqInterceptor = axiosInstanceSecure.interceptors.request.use(config => {
            config.headers.authorization = `Bearer ${user?.accessToken}`
            return config;
        })

        const myInterceptor = axiosInstanceSecure.interceptors.response.use(response => {
            return response;
        }, (error) => {

            const statusCode = error?.status;
            console.log(statusCode)

            if (statusCode === 401 || statusCode === 403) {
                logout()
                    .then(() => {
                        navigate('/login')
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
            return Promise.reject(error);
        });

        return () => {
            axiosInstanceSecure.interceptors.request.eject(reqInterceptor);
            axiosInstanceSecure.interceptors.response.eject(myInterceptor);
        }

    }, [logout, navigate, user])

    return axiosInstanceSecure
};

export default useAxiosSecure;