import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../hooks/UseAxiosSecure';
import useLoader from '../hooks/UseLoader';
import Loader from '../components/Loader';
import toast, { ToastBar } from 'react-hot-toast';
import { useState } from 'react';

const MyAssets = () => {

    const axiosInstanceSecure = useAxiosSecure();

    const [searchAsset, setSearchAsset] = useState('')

    const [assetType, setAssetType] = useState('All')

    const { data: assignedAssets = [], refetch, isLoading } = useQuery({
        queryKey: ['assigned-assets', searchAsset],
        queryFn: async () => {
            const result = await axiosInstanceSecure.get(`/assigned-assets?searchAsset=${searchAsset}`)
            return result?.data
        }
    })

    let filteredAssets = [];

    if (assetType !== 'All') {
        filteredAssets = assignedAssets.filter(assignedAsset => assignedAsset?.assetType === assetType)
    }

    else {
        filteredAssets = [...assignedAssets]
    }

    const { loader, startLoading, stopLoading } = useLoader()

    const handleReturnAsset = (id, assignedAsset) => {
        startLoading()

        const updatedStatus = {
            status: 'active'
        }

        axiosInstanceSecure.patch(`/affiliations?employeeEmail=${assignedAsset?.requesterEmail}&companyName=${assignedAsset?.companyName}`, updatedStatus)
            .then(res => {
                console.log(res?.data)

                const updatedRequestStatus = {
                    requestStatus: 'returned'
                }

                axiosInstanceSecure.patch(`/requests?assetId=${assignedAsset?.assetId}&requesterEmail=${assignedAsset?.employeeEmail}`, updatedRequestStatus)
                    .then(res => {
                        console.log(res?.data)

                        const updatedStats = {
                            status: 'returned',
                            returnDate: new Date()
                        }

                        axiosInstanceSecure.patch(`/assigned-assets/${id}`, updatedStats)
                            .then(res => {
                                refetch()
                                console.log(res?.data)
                                stopLoading()
                                toast.success('Returned successfully')
                            })
                            .catch(err => {
                                console.log(err)
                                stopLoading()
                                toast.error('Failed to return')
                            })
                    })
                    .catch(err => {
                        console.log(err)
                        stopLoading()
                        toast.error('Failed to return')
                    })
            })
            .catch(err => {
                console.log(err)
                stopLoading()
                toast.error('Failed to return')
            })
    }

    if (loader) return <Loader></Loader>

    return (
        <div>
            <h1 className='text-3xl font-semibold text-gray-800 tracking-tight text-center mb-6'>My Assets</h1>
            {filteredAssets.length > 0 ? <p className='text-2xl font-bold mb-6 text-center text-gray-600'>Total Assets: {filteredAssets?.length}</p>
                : <h1 className='text-2xl font-bold mb-6 text-center text-gray-600'>No assets assigned yet</h1>}

            <div className='flex justify-between items-center mb-6 px-6'>
                <input type="text" placeholder='Search assets...' className='input input-bordered w-[320px]' onChange={(event) => setSearchAsset(event.target.value)} />

                <select className='select select-bordered w-[180px]' defaultValue='All' onChange={(event) => setAssetType(event.target.value)}>
                    <option value="All">All</option>
                    <option value="Returnable" >Returnable</option>
                    <option value="Non-returnable" >Non-returnable</option>
                </select>
            </div>

            <div className="shadow-sm">
                {filteredAssets.length > 0 && <table className="table text-center border-t border-gray-300 rounded-none">
                    {/* head */}
                    <thead className='bg-gray-100 text-gray-600'>
                        <tr>
                            <th>Asset Image</th>
                            <th>Asset Name</th>
                            <th>Asset Type</th>
                            <th>Company Name</th>
                            <th>Request Date</th>
                            <th>Approval Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <Loader></Loader> : filteredAssets.map(assignedAsset =>
                            <tr key={assignedAsset?._id} className='hover:bg-white'>
                                <td>
                                    <img
                                        src={assignedAsset?.assetImage}
                                        alt="Product Image"
                                        className="mask mask-squircle h-12 w-12" />
                                </td>
                                <td className='font-medium'>{assignedAsset?.assetName}</td>
                                <td className={`badge text-[12px] font-semibold ${assignedAsset?.assetType === 'Returnable' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {assignedAsset?.assetType}</td>

                                <td>{assignedAsset?.companyName}</td>
                                <td className='text-gray-600'>{assignedAsset?.returnDate ? new Date(assignedAsset?.returnDate).toLocaleDateString() : 'Pending'}</td>
                                <td className='text-gray-600'>{new Date(assignedAsset?.assignmentDate).toLocaleDateString()}</td>
                                <td><span className={`badge text-[12px] font-semibold ${assignedAsset?.status === 'assigned' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {assignedAsset?.status}</span></td>
                                <td className='flex gap-3 justify-center items-center py-6'>
                                    {assignedAsset?.status === 'returned' ? <span className='badge text-[12px] font-semibold bg-green-100 text-green-700'>Returned</span> : assignedAsset?.assetType === 'Returnable' ? <button className="btn btn-sm btn-outline" onClick={() => document.getElementById(`modal_return_${assignedAsset?._id}`).showModal()}>Return</button> : <span className='text-gray-400 text-sm py-1'>No Actions</span>}
                                    {/* Open the modal using document.getElementById('ID').showModal() method */}
                                    {/* Open the modal using document.getElementById('ID').showModal() method */}
                                    <dialog id={`modal_return_${assignedAsset?._id}`} className="modal modal-bottom sm:modal-middle">
                                        <div className="modal-box">
                                            <p className="py-4 text-left">Are you sure you want to return this asset?</p>
                                            <div className="modal-action">
                                                <form method="dialog" className='flex gap-3'>
                                                    {/* if there is a button in form, it will close the modal */}
                                                    <button className="btn btn-sm btn-outline" onClick={() => handleReturnAsset(assignedAsset?._id, assignedAsset)}>Return</button>
                                                    <button className="btn btn-sm btn-outline">Cancel</button>
                                                </form>
                                            </div>
                                        </div>
                                    </dialog>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>}
            </div>
        </div>
    );
};

export default MyAssets;