import React from 'react';
import { TailSpin } from 'react-loader-spinner';

const Loader = () => {
    return (
        <div className='flex justify-center items-center min-h-screen'>
            <TailSpin
                visible={true}
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    );
};

export default Loader;