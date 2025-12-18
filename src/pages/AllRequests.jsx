import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../hooks/UseAxiosSecure';
import useLoader from '../hooks/UseLoader';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import useUserInfo from '../hooks/UseUserInfo';

const AllRequests = () => {

    const axiosInstanceSecure = useAxiosSecure()

    const { email, companyLogo } = useUserInfo();

    const { data: requestsPerHR = [], refetch, isLoading } = useQuery({
        queryKey: ['requests', email],
        enabled: !!email,
        queryFn: async () => {
            const result = await axiosInstanceSecure.get(`/requests?hrEmail=${email}`);
            return result?.data
        }
    })

    console.log(requestsPerHR)

    const unreturnedRequests = requestsPerHR.filter(request => request?.requestStatus !== 'returned')

    const { loader, startLoading, stopLoading } = useLoader()

    const handleApproveRequest = (id, request) => {
        console.log(id)
        startLoading()

        axiosInstanceSecure.patch(`/assets/${id}`)
            .then(res => {
                console.log(res?.data)

                const updatedStatus = {
                    requestStatus: 'approved',
                    approvalDate: new Date()
                }

                axiosInstanceSecure.patch(`/requests?id=${request?._id}`, updatedStatus)
                    .then(res => {
                        refetch()

                        console.log(res?.data)

                        axiosInstanceSecure.get(`/assets/${id}`)
                            .then(res => {
                                console.log(res)

                                const assignedAsset = {
                                    assetId: res?.data?._id,
                                    assetName: res?.data?.productName,
                                    assetImage: res?.data?.productImage,
                                    assetType: res?.data?.productType,
                                    employeeEmail: request?.requesterEmail,
                                    employeeName: request?.requesterName,
                                    hrEmail: res?.data?.hrEmail,
                                    companyName: res?.data?.companyName,
                                    assignmentDate: new Date(),
                                    returnDate: null,
                                    status: "assigned"
                                }

                                axiosInstanceSecure.post('/assigned-assets', assignedAsset)
                                    .then(res => {
                                        console.log(res?.data)
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        stopLoading()
                                    })

                                const affiliation = {
                                    employeeEmail: request?.requesterEmail,
                                    employeeName: request?.requesterName,
                                    hrEmail: request?.hrEmail,
                                    companyName: request?.companyName,
                                    companyLogo: companyLogo,
                                    affiliationDate: new Date(),
                                    status: "inactive"
                                }

                                axiosInstanceSecure.post('/affiliations', affiliation)
                                    .then(res => {

                                        console.log(res?.data)

                                        stopLoading()
                                        toast.success('Approved successfully')
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        stopLoading()
                                        toast.success('Approved successfully')
                                    })
                            })
                            .catch(err => {
                                console.log(err)
                                stopLoading()
                                toast.error('Failed to approve')
                            })
                    })
                    .catch(err => {
                        console.log(err)
                        stopLoading()
                        toast.error('Failed to approve')
                    })
            })
            .catch(err => {
                console.log(err)
                stopLoading()
                toast.error('Failed to approve')
            })
    }

    const handleRejectRequest = id => {
        startLoading()

        const updatedStatus = {
            requestStatus: 'rejected'
        }

        axiosInstanceSecure.patch(`/requests/${id}`, updatedStatus)
            .then(res => {
                refetch()
                console.log(res?.data)
                stopLoading()
                toast.success('Rejected successfully')
            })
            .catch(err => {
                console.log(err)
                stopLoading()
                toast.success('Failed to reject')
            })
    }

    if (loader) return <Loader></Loader>

    return (
        <div>
            <h1 className='text-3xl font-semibold text-gray-800 tracking-tight mb-6 text-center'>All Requests</h1>
            {
                unreturnedRequests?.length > 0 ? <p className='text-2xl font-bold mb-6 text-center text-gray-600'>Total Requests: {unreturnedRequests?.length}</p>
                    : <p className='text-2xl font-bold mb-6 text-center text-gray-600'>No requests submitted yet</p>
            }
            <div className="shadow-sm overflow-x-auto">
                {unreturnedRequests?.length > 0 && <table className="table text-center border-t border-gray-300 rounded-none">
                    {/* head */}
                    <thead className='bg-gray-100 text-gray-600'>
                        <tr>
                            <th>Employee</th>

                            <th>Asset</th>

                            <th>Date</th>

                            <th>Status</th>

                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <Loader></Loader> : unreturnedRequests.map(request =>
                            <tr key={request?._id} className='hover:bg-white'>
                                <td>
                                    <span className='font-medium text-grey-500'>{request?.requesterName}</span><br />

                                    <span className='text-sm text-gray-500'>{request?.requesterEmail}</span>
                                </td>

                                <td className='font-medium'>{request?.assetName}</td>

                                <td className='text-gray-600'>{new Date(request?.requestDate).toLocaleDateString()}</td>

                                <td><span className={`badge text-[12px] font-semibold ${request?.requestStatus === 'approved' ? 'bg-green-100 text-green-700' : request?.requestStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{request?.requestStatus}</span></td>

                                <td className='flex gap-3 justify-center items-center py-6'>
                                    {request?.requestStatus === 'approved' ? <span className='badge text-[12px] font-semibold bg-green-100 text-green-700'>Approved</span> :
                                        request?.requestStatus === 'rejected' ? <span className='badge text-[12px] font-semibold bg-red-100 text-red-700'>Rejected</span> :
                                            <>
                                                < button className="btn btn-sm btn-success text-white" onClick={() => document.getElementById(`modal_approve_${request?._id}`).showModal()}>Approve</button>

                                                <button className="btn btn-sm btn-error text-white" onClick={() => document.getElementById(`modal_reject_${request?._id}`).showModal()}>Reject</button>
                                            </>}

                                    {/* Open the modal using document.getElementById('ID').showModal() method */}
                                    {/* <button className="btn" onClick={() => document.getElementById('my_modal_5').showModal()}>open modal</button> */}
                                    <dialog id={`modal_approve_${request?._id}`} className="modal modal-bottom sm:modal-middle">
                                        <div className="modal-box">
                                            <p className="py-4 text-left">Are you sure you want to approve this request?</p>
                                            <div className="modal-action">
                                                <form method="dialog" className='flex items-center gap-3'>
                                                    {/* if there is a button in form, it will close the modal */}
                                                    <button className="btn btn-sm btn-success text-white" onClick={() => handleApproveRequest(request?.assetId, request)}>Approve</button>
                                                    <button className="btn btn-sm btn-outline">Cancel</button>
                                                </form>
                                            </div>
                                        </div>
                                    </dialog>

                                    {/* Open the modal using document.getElementById('ID').showModal() method */}
                                    <dialog id={`modal_reject_${request?._id}`} className="modal modal-bottom sm:modal-middle">
                                        <div className="modal-box">
                                            <p className="py-4 text-left">Are you sure you want to reject this request?</p>
                                            <div className="modal-action">
                                                <form method="dialog" className='flex items-center gap-3'>
                                                    {/* if there is a button in form, it will close the modal */}
                                                    <button className="btn btn-sm btn-error text-white" onClick={() => handleRejectRequest(request?.assetId)}>Reject</button>
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
        </div >
    );
};

export default AllRequests;