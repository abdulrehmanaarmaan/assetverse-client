import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
// import useAxiosSecure from '../hooks/UseAxiosSecure';
import useAxios from '../hooks/UseAxios';
import { CheckCircle } from 'lucide-react';

const UpgradeSuccess = () => {

    const [searchParams] = useSearchParams();

    const sessionId = searchParams?.get('session_id')

    console.log(sessionId)
    // const axiosInstanceSecure = useAxiosSecure();

    const axiosInstance = useAxios()

    const [paymentInfo, setPaymentInfo] = useState({})

    useEffect(() => {
        if (sessionId) {
            axiosInstance.patch(`/payment-success?session_id=${sessionId}`)
                .then(res => {
                    console.log(res)
                    setPaymentInfo({
                        trackingId: res.data.trackingId,
                        transactionId: res.data.transactionId
                    })
                })
        }
    }, [sessionId])

    return (
        <div>
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white border border-gray-300 rounded-2xl shadow-sm p-6 text-center">

                    <CheckCircle className="mx-auto text-green-500 w-14 h-14 mb-4" />

                    <h1 className="text-2xl font-semibold text-gray-800">
                        Payment Successful
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Your package has been upgraded successfully.
                    </p>

                    <div className="mt-6 text-sm text-gray-500 border-t pt-4 space-y-1">
                        <p>
                            <span className="font-medium">Transaction ID:</span>{' '}
                            {paymentInfo?.transactionId}
                        </p>
                        {/* <p> */}
                        {/* <span className="font-medium">Tracking ID:</span>{' '} */}
                        {/* {paymentInfo?.trackingId} */}
                        {/* </p> */}
                    </div>

                    <div className="mt-6 flex gap-3 justify-center">
                        <Link
                            to="/dashboard/asset-list"
                            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-400 font-semibold"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default UpgradeSuccess;
