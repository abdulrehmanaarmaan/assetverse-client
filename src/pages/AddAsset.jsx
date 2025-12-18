import React, { use } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../hooks/UseAxiosSecure';
import { AuthContext } from '../contexts/AuthContext';
import useUserInfo from '../hooks/UseUserInfo';
import toast from 'react-hot-toast';
import axios from 'axios';
import useLoader from '../hooks/UseLoader';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router';

const AddAsset = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const axiosInstanceSecure = useAxiosSecure();

    const { user } = use(AuthContext)

    const userInfo = useUserInfo();

    const { loader, startLoading, stopLoading } = useLoader()

    const navigate = useNavigate();

    const handleAddAsset = data => {

        startLoading()

        console.log(data)

        const productImage = data?.productImage[0]

        const form = new FormData()
        form.append('image', productImage)

        const image_API_URL = `https://api.imgbb.com/1/upload?expiration=600&key=${import.meta.env.VITE_image_host_key}`;

        axios.post(image_API_URL, form)
            .then(res => {
                console.log(res?.data)

                const productImgUrl = res?.data?.data?.display_url

                const asset = {
                    ...data, availableQuantity: Number(data?.productQuantity), productImage: productImgUrl, dateAdded: new Date(), hrEmail: user?.email, companyName: userInfo?.companyName
                }

                axiosInstanceSecure.post('/assets', asset)
                    .then(res => {
                        console.log(res?.data)
                        navigate('/dashboard/asset-list')
                        stopLoading()
                        toast.success('Added successfully')
                    })
                    .catch(err => {
                        console.log(err)
                        stopLoading()
                        toast.error('Failed to added')
                    })
            })
            .catch(err => {
                console.log(err)
                stopLoading()
                toast.error('Failed to update')
            })
    }

    if (loader) return <Loader></Loader>

    return (
        <div className="hero px-4">
            <div className="hero-content flex-col p-0">
                <div>
                    <h1 className='text-3xl font-semibold text-gray-800 tracking-tight text-center mb-6 mt-0'>Add a New Asset</h1>
                </div>
                <div className="card bg-base-100 w-full shrink-0 border border-gray-300">
                    <div className="card-body">
                        <form onSubmit={handleSubmit(handleAddAsset)}>
                            <fieldset className="fieldset grid-cols-1 gap-4">
                                <div>
                                    <label className="label mb-1">Product Name</label>
                                    <input type="text" className="input rounded-lg w-full" placeholder="Product Name" {...register('productName', { required: true })} />
                                </div>
                                <div>
                                    <label className="label mb-1">Product Image</label>
                                    <input type="file" accept="image/*" className="file-input block rounded-lg w-full" {...register('productImage', { required: true })} />
                                </div>
                                <div>
                                    <label className="label mb-1">Product Type</label>

                                    <select className="select appearance-none rounded-lg w-full" {...register('productType', { required: true })} defaultValue=''>
                                        <option value='' disabled>Pick a type</option>
                                        <option value='Returnable'>Returnable</option>
                                        <option value='Non-returnable'>Non-returnable</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label mb-1">Product Quantity</label>
                                    <input type="text" className="input rounded-lg w-full" placeholder="Product Quantity"
                                        {...register('productQuantity', {
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
                            <button className="btn bg-blue-500 mt-3 max-w-full w-full text-white hover:bg-blue-400 rounded-lg">Add Asset</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddAsset;