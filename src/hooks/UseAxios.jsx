import axios from 'axios';
import React from 'react';

const useAxios = () => {
    const axiosInstance = axios.create({
        baseURL: import.meta.env.VITE_API_URL
    })

    return axiosInstance
};

export default useAxios;