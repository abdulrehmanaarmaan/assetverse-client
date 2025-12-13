import React, { useState } from 'react';

const useLoader = () => {
    const [loader, showLoader] = useState(false);

    const startLoading = () => showLoader(true)

    const stopLoading = () => showLoader(false)

    return { loader, startLoading, stopLoading }
};

export default useLoader;