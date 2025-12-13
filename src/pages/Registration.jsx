import React, { use, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { NavLink, useNavigate, useParams } from 'react-router';
import Loader from '../components/Loader';
import useLoader from '../hooks/UseLoader';
import useAxiosPublic from '../hooks/UseAxios';
import toast from 'react-hot-toast';

const Registration = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const { signup, updateUserInfo, user, setUser } = use(AuthContext)

    const axiosInstance = useAxiosPublic();

    const { role } = useParams();

    const navigate = useNavigate();

    const { loader, startLoading, stopLoading } = useLoader()

    const handleManagerRegistration = data => {
        startLoading()

        console.log(data)

        const companyLogo = data?.companyLogo[0];
        const profileImage = data?.profileImage[0];
        const { password, ...rest } = data;

        signup(data?.email, password)
            .then(result => {
                console.log(result?.user)

                const form = new FormData();
                form.append('image', companyLogo)

                const form2 = new FormData();
                form2.append('image', profileImage)

                const image_API_URL = `https://api.imgbb.com/1/upload?expiration=600&key=${import.meta.env.VITE_image_host_key}`;

                axios.post(image_API_URL, form)
                    .then(res => {
                        console.log(res?.data)

                        const companyLogoUrl = res?.data?.data?.display_url;

                        axios.post(image_API_URL, form2)
                            .then(res => {
                                console.log(res?.data)
                                const userProfileUrl = res?.data?.data?.display_url

                                const updatedUser = { ...result?.user, displayName: data?.name, photoURL: userProfileUrl }
                                updateUserInfo(updatedUser)
                                    .then(() => {
                                        setUser(updatedUser)

                                        console.log('user info updated', user)

                                        axiosInstance.post('/users', {
                                            ...rest, companyLogo: companyLogoUrl, profileImage: userProfileUrl, createdAt: new Date(), updatedAt: new Date()
                                        })
                                            .then(res => {
                                                navigate('/dashboard/asset-list')
                                                console.log(res?.data)
                                                stopLoading()
                                                toast.success('Registered successfully')
                                            })
                                            .catch(err => {
                                                console.log(err)
                                                stopLoading()
                                                toast.error('Failed to register')
                                            })
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        stopLoading()
                                        toast.error('Failed to register')
                                    })
                            })
                            .catch(err => {
                                console.log(err)
                                stopLoading()
                                toast.error('Failed to register')
                            })
                    }
                    )
                    .catch(err => {
                        console.log(err)
                        stopLoading()
                        toast.error('Failed to register')
                    })
            }
            )
            .catch(error => {
                console.log(error)
                stopLoading()
                toast.error('Email already in use')
            })
    }

    const handleEmployeeRegistration = data => {
        startLoading()

        console.log(data)

        const profileImage = data?.profileImage[0];
        const { password, ...rest } = data;

        signup(data?.email, password)
            .then(result => {
                console.log(result?.user)

                const form = new FormData();
                form.append('image', profileImage)

                const image_API_URL = `https://api.imgbb.com/1/upload?expiration=600&key=${import.meta.env.VITE_image_host_key}`;

                axios.post(image_API_URL, form)
                    .then(res => {
                        console.log(res?.data)
                        const userProfileUrl = res?.data?.data?.display_url

                        const updatedUser = {
                            ...result?.user, displayName: data?.name, photoURL:
                                userProfileUrl
                        }
                        updateUserInfo(updatedUser)
                            .then(() => {
                                setUser(updatedUser)

                                console.log('successfully updated', user)

                                axiosInstance.post('/users', {
                                    ...rest, profileImage: userProfileUrl, createdAt: new Date(), updatedAt: new Date()
                                })
                                    .then(res => {
                                        navigate('/dashboard/request-asset')
                                        console.log('user added', res?.data)
                                        stopLoading()
                                        toast.success('Registered successfully')
                                    })
                                    .catch(error => {
                                        console.log("couldn't add user", error)
                                        stopLoading()
                                        toast.error('Failed to register')
                                    })
                            })
                            .catch(error => {
                                console.log("couldn't update user data", error)
                                stopLoading()
                                toast.error('Failed to register')
                            })
                    })
                    .catch(error => {
                        console.log(error)
                        stopLoading()
                        toast.error('Email already in use')
                    })
            }
            )
            .catch(error => {
                console.log(error)
                stopLoading()
                toast.error('Email already in use')
            })
    }

    useEffect(() => {
        reset({
            role: role === 'employee' ? 'employee' : 'hr',
            email: '',
            name: '',
            password: '',
            profileImage: '',
            dateOfBirth: '',
        })
    }, [reset, role])

    if (loader) return <Loader></Loader>

    if (role === 'employee') {
        return (
            <div className="hero">
                <div className="hero-content flex-col p-0">
                    <div>
                        <h1 className='text-3xl font-semibold text-gray-800 tracking-tight text-center mb-6'>Create an Employee Account</h1>
                    </div>
                    <div className="card bg-base-100 w-full shrink-0 border border-gray-300">
                        <div className="card-body">
                            <form onSubmit={handleSubmit(handleEmployeeRegistration)}>
                                <fieldset className="fieldset grid-cols-2 gap-4">
                                    <div>
                                        <label className="label mb-1">Email</label>
                                        <input type="email" className="input rounded-lg" placeholder="Email" {...register('email', { required: true })} />
                                    </div>
                                    <div>
                                        <label className="label mb-1">Password</label>
                                        <input type="password" className="input rounded-lg" placeholder="Password" {...register('password', { required: true, pattern: { value: /^.{6,}$/, message: 'Password must include at least 6 characters.' } })} />
                                        {errors.password && <p className='text-red-500 mt-2'>{errors.password.
                                            message}</p>}
                                    </div>
                                    <div>
                                        <label className="label mb-1">Name</label>
                                        <input type="text" className="input rounded-lg" placeholder="Name" {...register('name', { required: true })} />
                                    </div>
                                    <div>
                                        <label className="label mb-1">Profile Image</label>
                                        <input type="file" accept="image/*" className="file-input block rounded-lg" {...register('profileImage', { required: true })} />
                                    </div>
                                    <div>
                                        <label className="label mb-1">Date of Birth</label>
                                        <input type="date" className="input rounded-lg" {...register('dateOfBirth', { required: true })} />
                                    </div>
                                    <div>
                                        <label className="label mb-1">Role</label>
                                        <input type="text" className="input rounded-lg cursor-not-allowed" placeholder="Role" {...register('role')} readOnly />
                                    </div>
                                </fieldset>
                                {Object.values(errors).some(err => err.type === 'required') && <p className='text-red-500 mt-2'>All fields are required.</p>}
                                <button className="btn bg-blue-500 mt-3 max-w-full w-full text-white hover:bg-blue-400 rounded-lg">Register</button>

                                <p className='text-center font-medium mt-3'>Already have an account? <NavLink to='/login' className='hover:text-blue-500 hover:underline'>Log in</NavLink></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (role === 'hr-manager') {
        return (
            <div className="hero">
                <div className="hero-content flex-col p-0">
                    <div>
                        <h1 className='text-3xl font-semibold text-gray-800 tracking-tight text-center mb-6'>Create a HR Manager Account</h1>
                    </div>
                    <div className="card bg-base-100 w-full shrink-0 border border-gray-300">
                        <div className="card-body">
                            <form onSubmit={handleSubmit(handleManagerRegistration)}>
                                <fieldset className="fieldset grid-cols-2 gap-4">
                                    <div>
                                        <label className="label mb-1">Email</label>
                                        <input type="email" className="input rounded-lg" placeholder="Email" {...register('email', { required: true })} />
                                    </div>
                                    <div>
                                        <label className="label mb-1">Password</label>
                                        <input type="password" className="input rounded-lg" placeholder="Password" {...
                                            register('password', {
                                                required: true, pattern: {
                                                    value: /^.{6,}$/,
                                                    message: 'Password must include at least 6 characters.'
                                                }
                                            })} />
                                        {errors.password && <p className='text-red-500 mt-2'>{errors.password.
                                            message}</p>}
                                    </div>
                                    <div>
                                        <label className="label mb-1">Name</label>
                                        <input type="text" className="input rounded-lg" placeholder="Name" {...register('name', { required: true })} />
                                    </div>
                                    <div>
                                        <label className="label mb-1">Profile Image</label>
                                        <input type="file" accept="image/*" className="file-input block rounded-lg" {...
                                            register('profileImage', { required: true })} />
                                    </div>
                                    <div>
                                        <label className="label mb-1">Company Name</label>
                                        <input defaultValue='' type="text" className="input rounded-lg" placeholder="Company Name" {...
                                            register('companyName', { required: true })} />
                                    </div>
                                    <div>
                                        <label className="label mb-1">Company Logo</label>
                                        <input type="file" accept="image/*" className="file-input block rounded-lg" {...
                                            register('companyLogo', { required: true })} />
                                    </div>
                                    <div>
                                        <label className="label mb-1">Date of Birth</label>
                                        <input type="date" className="input rounded-lg" {...register('dateOfBirth', {
                                            required: true
                                        })} />
                                    </div>
                                    <div>
                                        <label className="label mb-1">Role</label>
                                        <input type="text" className="input rounded-lg" placeholder="Role" {...register('role')} readOnly />
                                    </div>
                                    <div>
                                        <label className="label mb-1">Package Limit</label>
                                        <input type="text" className="input rounded-lg" placeholder="Package Limit" {...
                                            register('packageLimit', {
                                                required: true, pattern: {
                                                    value: /^[0-9]+$/, message: 'Please type only an integer.'
                                                }
                                            })} />
                                        {errors.packageLimit && <p className='text-red-500 mt-2'>{errors.
                                            packageLimit.
                                            message}</p>}
                                    </div>
                                    <div>
                                        <label className="label mb-1">Current Employees</label>
                                        <input type="text" className="input rounded-lg" placeholder="Current Employees"
                                            {...register('currentEmployees', {
                                                required: true, pattern: {
                                                    value: /^[0-9]+$/, message: 'Please type only an integer.'
                                                }
                                            })} />
                                        {errors.currentEmployees && <p className='text-red-500 mt-2'>{errors.
                                            currentEmployees.
                                            message}</p>}
                                    </div>
                                    <div>
                                        <label className="label mb-1">Subscription</label>
                                        <input type="text" className="input rounded-lg" placeholder="Subscription" {...
                                            register('subscription', { required: true })} defaultValue={'basic'} />
                                    </div>
                                </fieldset>
                                {Object.values(errors).some(err => err.type === 'required') && <p className='text-red-500 mt-2'>All
                                    fields are required.</p>}
                                <button className="btn bg-blue-500 mt-3 max-w-full w-full text-white hover:bg-blue-400 rounded-lg">Register</button>

                                <p className='text-center font-medium mt-3'>Already have an account? <NavLink
                                    to='/login' className='hover:text-blue-500 hover:underline'>Log in</NavLink></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Registration;