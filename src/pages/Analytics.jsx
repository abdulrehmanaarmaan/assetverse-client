import { useQuery } from '@tanstack/react-query';
import { BarChart3, PieChart as PieIcon } from 'lucide-react';
import React, { use } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import useAxiosSecure from '../hooks/UseAxiosSecure';
import useUserInfo from '../hooks/UseUserInfo';
import { AuthContext } from '../contexts/AuthContext';

const Analytics = () => {

    const axiosInstanceSecure = useAxiosSecure();

    const { user } = use(AuthContext)

    const { data: assets = [] } = useQuery({
        queryKey: ['assets'],
        queryFn: async () => {
            const result = await axiosInstanceSecure.get('/assets')
            return result?.data
        }
    })

    const assetsPerHr = assets.filter(asset => asset?.hrEmail === user?.email)

    const { data: requestsPerHR = [] } = useQuery({
        queryKey: ['requests', user?.email],
        queryFn: async () => {
            const result = await axiosInstanceSecure.get(`/requests?hrEmail=${user?.email}`)
            return result?.data
        }
    })

    const requestCounts = requestsPerHR.reduce((acc, req) => {
        acc[req.assetId] = (acc[req.assetId] || 0) + 1;
        return acc
    }, {})

    const assetsWithCounts = assetsPerHr.map(asset => ({
        ...asset,
        requestCount: requestCounts[asset?._id] || 0
    }))

    console.log(assetsWithCounts)

    const top5 = assetsWithCounts.sort((a, b) => b.requestCount - a.requestCount).slice(0, 5)

    console.log(top5)

    const getPieChartData = data => {
        const returnable = data.filter(asset => asset.productType === 'Returnable').length
        const nonReturnable = data.filter(asset => asset.productType === 'Non-returnable').length
        return [{ name: 'Returnable', value: returnable },
        { name: 'Non-returnable', value: nonReturnable }
        ]
    }

    const getBarChartData = data => {
        return data.map(asset => { return { name: asset?.productName, requests: asset?.requestCount } })
    }

    return (
        <div>
            <div className="p-6">
                <h1 className="text-3xl font-semibold text-gray-800 tracking-tight text-center mb-6">Analytics Dashboard</h1>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Pie Chart Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <PieIcon className="w-5 h-5 text-gray-600" />
                            <h2 className="text-lg font-semibold">
                                Returnable vs Non-returnable Items
                            </h2>
                        </div>

                        <div className="w-full h-72 flex justify-center items-center">
                            {assetsPerHr.length > 0 ? <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={getPieChartData(assetsPerHr)}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label
                                    >

                                        <Cell key='Returnable' fill='#4fa94d' />
                                        <Cell key='Non-returnable' fill='#f87171' />

                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                                :
                                <p className='text-gray-500 text-sm'>No assets added yet</p>}
                        </div>
                    </div>

                    {/* Bar Chart Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="w-5 h-5 text-gray-600" />
                            <h2 className="text-lg font-semibold">Top 5 Most Requested Assets</h2>
                        </div>

                        <div className="w-full h-72 flex justify-center items-center">
                            {top5.length > 0 ? <ResponsiveContainer>
                                <BarChart data={getBarChartData(top5)}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="requests" fill="#4fa94d" />
                                </BarChart>
                            </ResponsiveContainer>
                                : <p className='text-gray-500 text-sm'>No assets requested yet</p>}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Analytics;