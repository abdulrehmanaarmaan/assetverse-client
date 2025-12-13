import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
// import useAxiosSecure from '../hooks/UseAxiosSecure';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useLoader from '../hooks/UseLoader';
import Loader from '../components/Loader';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import useAxiosSecure from '../hooks/UseAxiosSecure';
import useUserInfo from '../hooks/UseUserInfo';
// import { AuthContext } from '../contexts/AuthContext';

const AssetList = () => {

    // 🔥 NEW: Pagination state
    // const [page, setPage] = useState(1);
    // const limit = 10;

    // 🔥 UPDATED React Query
    // const { data, refetch, isPending } = useQuery({
    // queryKey: ['assets', page],
    // queryFn: async () => {
    // const result = await axiosInstanceSecure.get(`/assets?page=${page}&limit=${limit}`);
    // return result.data;
    // }
    // });

    // const assets = data?.data || [];
    // const pagination = data?.pagination;

    const [page, setPage] = useState(1);
    const limit = 10;

    const axiosInstanceSecure = useAxiosSecure();

    const { email } = useUserInfo()

    const { data: assets, refetch, isLoading } = useQuery({
        queryKey: ['assets', page, email],
        keepPreviousData: true,
        queryFn: async () => {
            const result = await axiosInstanceSecure.get(`/assets?page=${page}&limit=${limit}&hrEmail=${email}`);
            return result?.data
        },
        initialData: {
            data: [],
            pagination: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 1
            }
        }
    })

    const [selectedAsset, setSelectedAsset] = useState({})

    const allAssets = assets?.data || [];
    const pagination = assets?.pagination || {};

    const { handleSubmit, register, formState: { errors }, reset } = useForm()

    const { loader, startLoading, stopLoading } = useLoader()

    const handleEditAsset = (data, id) => {
        startLoading()

        console.log(data)

        const { productImage, ...rest } = data

        console.log(rest)

        let allInfo = {};

        if (productImage) {
            const productImg = productImage[0]

            const form = new FormData()
            form.append('image', productImg)

            const image_API_URL = `https://api.imgbb.com/1/upload?expiration=600&key=${import.meta.env.VITE_image_host_key}`;

            axios.post(image_API_URL, form)
                .then(res => {

                    console.log(res?.data?.data?.display_url)

                    const productImageUrl = res?.data?.data?.display_url

                    allInfo = { ...rest, productImage: productImageUrl }

                    axiosInstanceSecure.patch(`/assets?id=${id}`, { ...allInfo, availableQuantity: allInfo?.productQuantity })
                        .then(res => {
                            console.log(res?.data)
                            if (res?.data?.modifiedCount !== 0) {
                                refetch()
                                stopLoading()
                                toast.success('Updated successfully')
                            }
                            else {
                                stopLoading()
                                toast.error('No changes in update')
                            }
                        })
                        .catch(err => {
                            console.log(err)
                            stopLoading()
                            toast.error('Failed to update')
                        })
                })
                .catch(err => {
                    console.log(err)
                    stopLoading()
                    toast.error('Failed to update')
                })
        }

        else {
            console.log(data)
            // const { productImage, ...rest } = data
            allInfo = {
                productName: data?.productName,
                productQuantity: data?.productQuantity,
                productType: data?.productType,
            }

            axiosInstanceSecure.patch(`/assets?id=${id}`, { ...allInfo, availableQuantity: allInfo?.productQuantity })
                .then(res => {
                    if (res?.data?.modifiedCount !== 0) {
                        refetch()
                        stopLoading()
                        toast.success('Updated successfully')
                    }
                    else {
                        stopLoading()
                        toast.error('No changes in update')
                    }
                })
                .catch(err => {
                    console.log(err)
                    stopLoading()
                    toast.error('Failed to update')
                })
        }
    }

    const handleDeleteAsset = id => {

        startLoading()
        axiosInstanceSecure.delete(`/assets?id=${id}`)
            .then(res => {
                refetch()
                console.log(res?.data)
                stopLoading()
                toast.success('Deleted successfully')
            })
            .catch(err => {
                console.log(err)
                stopLoading()
                toast.error('Failed to delete')
            })
    }

    if (loader) return <Loader></Loader>

    return (
        <div>
            <h1 className='text-3xl font-semibold text-gray-800 tracking-tight text-center mb-6'>Asset List</h1>
            {allAssets?.length ? <p className='text-2xl font-bold mb-6 text-center text-gray-600'>Page: {pagination?.page} of {pagination?.totalPages}</p>
                : <p className='text-2xl font-bold mb-6 text-center text-gray-600'>No assets added yet</p>}
            <div className="shadow-sm">
                {allAssets.length > 0 && <table className="table text-center border-t border-gray-300 rounded-none">
                    {/* head */}
                    <thead className='bg-gray-100 text-gray-600'>
                        <tr>
                            <th>Asset Image</th>

                            <th>Name</th>

                            <th>Type</th>

                            <th>Quantity</th>

                            <th>Date Added</th>

                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {isLoading ? <Loader></Loader> : allAssets.map(asset =>
                            <tr key={asset?._id} className='hover:bg-white'>
                                <td>
                                    <img
                                        src={asset?.productImage}
                                        alt="Product Image"
                                        className="mask mask-squircle h-12 w-12" />
                                </td>

                                <td className='font-medium'>{asset?.productName}</td>

                                <td className={`badge text-[12px] font-semibold ${asset?.productType === 'Returnable' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{asset?.productType}</td>

                                <td>
                                    <button className="">{asset?.productQuantity}</button>
                                </td>

                                <td className='text-gray-600'>{new Date(asset?.dateAdded).toLocaleDateString()}</td>

                                <td className='flex gap-3 justify-center items-center py-6'>
                                    <button className="btn btn-sm btn-outline btn-info" onClick={() => {
                                        setSelectedAsset(asset)

                                        reset({
                                            productName: asset?.productName,
                                            productImage: null,
                                            productType: asset?.productType,
                                            productQuantity: asset?.productQuantity
                                        })

                                        document.getElementById(`modal_edit_${asset?._id}`).showModal()
                                    }}>Edit</button>

                                    <button className="btn btn-sm btn-error text-white" onClick={() => document.getElementById(`modal_delete_${asset?._id}`).showModal()}>Delete</button>

                                    {/* Open the modal using document.getElementById('ID').showModal() method */}
                                    <dialog id={`modal_edit_${asset?._id}`} className="modal modal-bottom sm:modal-middle">
                                        {/* if there is a button in form, it will close the modal */}
                                        <div className="hero-content modal-box max-h-fit bg-linear-to-b from-gray-50 to-gray-200">
                                            <div className='modal-action flex-col'>
                                                <div>
                                                    <h1 className='text-2xl font-bold text-center mb-4'>Update Asset Info: {selectedAsset?.productName}</h1>
                                                </div>
                                                <div className="card bg-base-100 w-full shrink-0 border border-gray-300">
                                                    <div className="card-body">
                                                        <form onSubmit={handleSubmit(data => handleEditAsset(data, asset?._id))} method="dialog">
                                                            <fieldset className="fieldset grid-cols-1 gap-4 text-left">
                                                                <div>
                                                                    <label className="label mb-1">Product Name</label>
                                                                    <input type="text" className="input block w-full rounded-lg" placeholder="Product Name" {...register('productName', {
                                                                        required: true
                                                                    })} />
                                                                </div>

                                                                <div>
                                                                    <label className="label mb-1">Current Product Image</label>
                                                                    <img src={asset?.productImage} alt="" className='max-w-6 rounded' />
                                                                </div>

                                                                <div>
                                                                    <label className="label mb-1">New Product Image (optional)</label>
                                                                    <input type="file" accept="image/*" className="input block w-full rounded-lg" {...register('productImage')} />
                                                                </div>
                                                                <div>
                                                                    <label className="label mb-1">Product Type</label>
                                                                    <select className="select appearance-none block w-full rounded-lg" {...register('productType', { required: true })}>
                                                                        <option value='' disabled>Pick a type</option>
                                                                        <option value='Returnable'>Returnable</option>
                                                                        <option value='Non-returnable'>Non-returnable</option>
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <label className="label mb-1">Product Quantity</label>
                                                                    <input type="text" className="input block w-full rounded-lg" placeholder="Product Quantity" {...register('productQuantity', {
                                                                        required: true, pattern: {
                                                                            value: /^[0-9]+$/, message: 'Please type only an integer.'
                                                                        }
                                                                    })} />
                                                                    {errors.productQuantity && <p className='text-red-500 mt-2'>{errors.
                                                                        productQuantity.
                                                                        message}</p>}
                                                                </div>
                                                            </fieldset>
                                                            {Object.values(errors).some(err => err.type === 'required') && <p
                                                                className='text-red-500 mt-2'>All fields are required.</p>}
                                                            <button className="btn bg-blue-500 mt-3 max-w-full w-full text-white hover:bg-blue-400 rounded-lg">Update Asset</button>
                                                        </form>

                                                        <button className="btn rounded-lg" onClick={() => document.getElementById(`modal_edit_${asset?._id}`).close()}>Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </dialog>

                                    {/* Open the modal using document.getElementById('ID').showModal() method */}
                                    <dialog id={`modal_delete_${asset?._id}`} className="modal modal-bottom sm:modal-middle">
                                        <div className="modal-box">
                                            <p className="py-4 text-left">Are you sure you want to delete this asset?</p>
                                            <div className="modal-action">
                                                <form method="dialog" className='flex gap-3'>
                                                    {/* if there is a button in form, it will close the modal */}
                                                    <button className="btn btn-sm btn-error text-white" onClick={() => handleDeleteAsset(asset?._id)}>Delete</button>
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

            {allAssets.length > 0 && <div className="flex justify-center gap-2 mt-5">

                <button
                    className="btn btn-sm"
                    disabled={page === 1}
                    onClick={() => setPage(prev => prev - 1)}>
                    Previous
                </button>

                {pagination?.totalPages && Array.from({ length: pagination?.totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={`btn btn-sm ${page === i + 1 ? "btn-active" : ""}`}
                        onClick={() => setPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    className="btn btn-sm"
                    disabled={pagination && page === pagination?.totalPages}
                    onClick={() => setPage(prev => prev + 1)}>
                    Next
                </button>
            </div>}
        </div >
    );
};

export default AssetList;