// import React, { useEffect } from 'react';
// import toast from 'react-hot-toast';
import useAxiosSecure from '../hooks/UseAxiosSecure';
// import { AuthContext } from '../contexts/AuthContext';
import useUserInfo from '../hooks/UseUserInfo';
import { useQuery } from '@tanstack/react-query';
// import { useSearchParams } from 'react-router';
import useAxios from '../hooks/UseAxios';
import Loader from '../components/Loader';
import useLoader from '../hooks/UseLoader';
// import useLoader from '../hooks/UseLoader';

const UpgradePackage = () => {

    const { loader, startLoading, stopLoading } = useLoader()

    const axiosInstanceSecure = useAxiosSecure()

    const { data: packages = [], isLoading } = useQuery({
        queryKey: ['packages'],
        queryFn: async () => {
            const result = await axiosInstanceSecure.get('/packages');
            return result?.data
        }
    })

    // const { loader, startLoading, stopLoading } = useLoader()

    const { email, subscription } = useUserInfo()

    const axiosInstance = useAxios();

    const handlePayment = (pkg) => {
        startLoading()

        const payment = {
            hrEmail: email,
            packageName: pkg?.name,
            employeeLimit: Number(pkg?.employeeLimit),
            amount: Number(pkg?.price),
            paymentDate: new Date(),
            status: 'pending'
        }

        console.log(payment)

        axiosInstance.post('/create-checkout-session', payment)
            .then(res => {
                console.log(res)
                stopLoading()
                window.location.href = res?.data?.url
            })
            .catch(err => {
                console.log(err)
                stopLoading()
            })
    }

    // const [params] = useSearchParams('session_id')

    // const sessionId = params.get('session_id')

    // useEffect(() => {
    // if (!sessionId) return;
    // axiosInstanceSecure.post('/confirm-payment', { sessionId })
    // .then(res => {
    // console.log(res)
    // toast.success('Payment successful')
    // })
    // .catch(() => toast.error('Payment failed'));
    // }, [sessionId, axiosInstanceSecure]);

    const { data: paymentHistory = [] } = useQuery({
        queryKey: ['payments'],
        queryFn: async () => {
            const result = await axiosInstanceSecure.get('/payment-history')
            return result?.data
        }
    })

    const currentPlan = packages.find(
        pkg => pkg?.name.toLowerCase() === subscription.toLowerCase()
    );

    if (loader) return <Loader></Loader>

    return (
        <div>
            <div className="">

                {/* ------------------ Title ------------------ */}
                <div className="mb-6">
                    <h1 className=" text-3xl font-semibold text-gray-800 tracking-tight text-center mb-6">Upgrade Package</h1>
                    <p className="text-2xl font-bold mb-6 text-center text-gray-600">
                        Select a package that fits your company’s needs
                    </p>
                </div>

                {/* ------------------ Current Plan ------------------ */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
                    <h2 className="text-xl font-semibold text-blue-900">
                        Current Package: {currentPlan?.name || "No Package Active"}
                    </h2>
                    <p className="text-blue-700">
                        Employee Limit: {currentPlan?.employeeLimit || 0}
                    </p>
                </div>

                {/* ------------------ Plans List ------------------ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {isLoading ? <Loader></Loader> : packages.map((pkg, index) => (
                        <div
                            key={index}
                            className="bg-white border rounded-2xl shadow hover:shadow-xl p-6 flex flex-col border-gray-300"
                        >
                            <h3 className="text-2xl font-bold text-gray-800">{pkg?.name}</h3>

                            <p className="text-4xl font-extrabold mt-3">
                                ${pkg?.price}
                                <span className="text-gray-500 text-base">/month</span>
                            </p>

                            <p className="text-gray-500 mt-1">
                                Up to {pkg?.employeeLimit} employees
                            </p>

                            <ul className="mt-5 space-y-2 text-gray-700">
                                {isLoading ? <Loader></Loader> : pkg?.features?.map((f, i) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="text-green-600">✓</span> {f}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handlePayment(pkg)}
                                disabled={currentPlan?.name === pkg?.name}
                                className={`mt-6 py-3 rounded-lg font-semibold transition ${currentPlan?.name === pkg.name
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-500 text-white hover:bg-blue-400 hover:cursor-pointer"
                                    }`}
                            >
                                {currentPlan?.name === pkg?.name ? "Current Plan" : "Upgrade"}
                            </button>
                        </div>
                    ))}
                </div>

                {/* ------------------ Payment History ------------------ */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-600">Payment History</h2>

                    {paymentHistory.length === 0 ? (
                        <p className="text-gray-600 text-center">No payments yet</p>
                    ) : (

                        <div className="shadow-sm">
                            <table className="table text-center border-t border-gray-300 rounded-none">
                                {/* head */}
                                <thead className='bg-gray-100 text-gray-600'>
                                    <tr>
                                        <th>Plan</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody className=''>
                                    {isLoading ? <Loader></Loader> : paymentHistory.map(payment =>
                                        <tr key={payment?._id} className='hover:bg-white border'>
                                            <td className='font-medium'>{payment?.packageName}</td>
                                            <td className='font-medium'>${payment?.amount}</td>
                                            <td className='text-gray-600'>{new Date(payment?.paymentDate).toLocaleDateString()}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
};


export default UpgradePackage;