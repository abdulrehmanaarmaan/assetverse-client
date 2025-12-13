import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../hooks/UseAxiosSecure';
import useUserInfo from '../hooks/UseUserInfo';
import useLoader from '../hooks/UseLoader';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import { Navigate } from 'react-router';

const MyEmployee = () => {

    const axiosInstanceSecure = useAxiosSecure()

    const { email, subscription } = useUserInfo()

    const { data: employeesPerCompany = [], refetch } = useQuery({
        queryKey: ['affiliations', email],
        queryFn: async () => {
            const result = await axiosInstanceSecure.get(`/affiliations?hrEmail=${email}`)
            return result?.data
        }
    })

    const { data: pkg } = useQuery({
        queryKey: ['packages', subscription],
        queryFn: async () => {
            const result = await axiosInstanceSecure.get(`/packages?name=${subscription}`)
            return result?.data
        }
    })

    console.log(pkg)

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const result = await axiosInstanceSecure.get('/users');
            return result?.data
        }
    })

    const { data: assignedAssets = [] } = useQuery({
        queryKey: ['assigned-assets'],
        queryFn: async () => {
            const result = await axiosInstanceSecure.get('/assigned-assets')
            return result?.data
        }
    })

    const employeesEmails = employeesPerCompany.map(employee => employee?.employeeEmail)

    const assignedEmployees = users.filter(user => employeesEmails.includes(user?.email))

    console.log(assignedEmployees)

    console.log(assignedAssets)

    const { loader, startLoading, stopLoading } = useLoader()

    const handleRemoveEmployee = email => {
        startLoading()

        axiosInstanceSecure.delete(`/affiliations?email=${email}`)
            .then(res => {
                refetch()

                console.log(res)
                stopLoading()
                toast.success('Removed successfully')
            })
            .catch(err => {
                console.log(err)
                stopLoading()
                toast.error('Failed to remove')
            })
    }

    if (employeesPerCompany.length > pkg?.employeeLimit) {
        return <Navigate to='/dashboard/upgrade-package'></Navigate>
    }

    if (loader) return <Loader></Loader>

    return (
        <div>
            <h1 className='text-3xl font-semibold text-gray-800 tracking-tight text-center mb-6'>My Employee List</h1>
            {employeesPerCompany?.length ? <p className='text-2xl font-bold mb-6 text-center text-gray-600'>Employee Count: {employeesPerCompany?.length}/{pkg?.employeeLimit}</p>
                : <p className='text-2xl font-bold mb-6 text-center text-gray-600'>No employees added yet</p>}
            <div className="shadow-sm">
                {assignedEmployees.length > 0 && <table className="table text-center border-t border-gray-300 rounded-none">
                    {/* head */}
                    <thead className='bg-gray-100 text-gray-600'>
                        <tr>
                            <th>Employee Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Join Date</th>
                            <th>Assets Count</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <Loader></Loader> : assignedEmployees.map(assignedEmployee =>
                            <tr key={assignedEmployee?._id} className='hover:bg-white'>
                                <td>
                                    <img
                                        src={assignedEmployee?.profileImage}
                                        alt="Product Image"
                                        className="mask mask-squircle h-12 w-12" />
                                </td>
                                <td className='font-medium'>{assignedEmployee?.name}</td>

                                {/* <td className={`badge text-[12px] font-semibold ${assignedEmployee?.productType === 'Returnable' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{assignedEmployee?.productType}</td> */}

                                <td>
                                    <button className="">{assignedEmployee?.email}</button>
                                </td>
                                <td className='text-gray-600'>{new Date(employeesPerCompany.find(employeeEmail => employeeEmail?.employeeEmail === assignedEmployee?.email)?.affiliationDate).toLocaleDateString()}</td>
                                <td>{assignedAssets.filter(assignedAsset => assignedAsset?.employeeEmail === assignedEmployee?.email)?.length}</td>
                                <td className='flex gap-3 justify-center items-center py-6'>

                                    <button className="btn btn-sm btn-error text-white" onClick={() => document.getElementById(`modal_remove_${assignedEmployee?._id}`).showModal()}>Remove from Team</button>
                                    {/* Open the modal using document.getElementById('ID').showModal() method */}
                                    {/* Open the modal using document.getElementById('ID').showModal() method */}
                                    <dialog id={`modal_remove_${assignedEmployee?._id}`} className="modal modal-bottom sm:modal-middle">
                                        <div className="modal-box">
                                            <p className="py-4 text-left">Are you sure you want to remove this employee?</p>
                                            <div className="modal-action">
                                                <form method="dialog" className='flex gap-3'>
                                                    {/* if there is a button in form, it will close the modal */}
                                                    <button className="btn btn-sm btn-error text-white" onClick={() => handleRemoveEmployee(assignedEmployee?.email)}>Remove</button>
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

export default MyEmployee;