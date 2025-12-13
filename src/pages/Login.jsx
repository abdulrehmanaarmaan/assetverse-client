import React, { use } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router';
import Loader from '../components/Loader';
import useLoader from '../hooks/UseLoader';
import useUserInfo from '../hooks/UseUserInfo';
import toast from 'react-hot-toast';

const Login = () => {
    const { login } = use(AuthContext);

    const { register, handleSubmit, formState: { errors } } = useForm()

    const { role } = useUserInfo();

    const { loader, startLoading, stopLoading } = useLoader()

    const navigate = useNavigate()

    const handleLogin = data => {
        startLoading()
        console.log(data)
        login(data?.email, data?.password)
            .then(result => {
                navigate(role === 'hr' ? '/dashboard/asset-list' : '/dashboard/request-asset')
                console.log(result?.user)
                stopLoading()
                toast.success('Logged in successfully')
            })
            .catch(error => {
                console.log(error)
                stopLoading()
                toast.error("Email doesn't exist")
            })
    }

    if (loader) return <Loader></Loader>

    return (
        <div>
            <div className="hero">
                <div className="hero-content flex-col p-0">
                    <div>
                        <h1 className='text-3xl font-semibold text-gray-800 tracking-tight text-center mb-6'>Log in to your account</h1>
                    </div>
                    <div className="card bg-base-100 w-full max-w-full shrink-0 border border-gray-300">
                        <div className="card-body">
                            <form className="fieldset" onSubmit={handleSubmit(handleLogin)}>
                                <label className="label">Email</label>
                                <input type="email" className="input mb-3 rounded-lg" placeholder="Email" {...register('email', { required: true })} />
                                <label className="label">Password</label>
                                <input type="password" className="input rounded-lg" placeholder="Password" {...register('password', { required: true })} />
                                {/* <div><a className="link link-hover">Forgot password?</a></div> */}
                                {Object.values(errors).some(err => err.type === 'required') && <p className='text-red-500 mt-2'>All
                                    fields are required.</p>}
                                <button className="btn bg-blue-500 mt-4 text-white hover:bg-blue-400 rounded-lg">Login</button>
                                <span className='text-center font-medium mt-2 text-[14px]'>Don't have an account?
                                    <span className='mt-2 block'>Register as a <NavLink to='/registration/hr-manager' className='hover:text-blue-500 hover:underline'>HR</NavLink> or an <NavLink to='/registration/employee' className='hover:text-blue-500 hover:underline'>employee</NavLink></span>
                                </span>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;