// import React, { use } from 'react';
import { NavLink } from 'react-router';
import { AuthContext } from '../contexts/AuthContext';
import { use } from 'react';
import { FiPackage } from 'react-icons/fi';
import useUserInfo from '../hooks/UseUserInfo';

const Navbar = () => {
    const publicLinks = <>
        <NavLink to='/' className='font-semibold hover:text-blue-400'>Home</NavLink>
        <NavLink to='/registration/employee' className='font-semibold hover:text-blue-400'>Join as Employee</NavLink>
        <NavLink to='/registration/hr-manager' className='font-semibold hover:text-blue-400'>Join as HR Manager</NavLink>
    </>

    const { user, logout } = use(AuthContext);

    const handleLogout = () => {
        logout()
            .then(() => {
                console.log('logged out')
            })
            .catch(() => {
                console.log('error caught')
            })
    }

    const { role } = useUserInfo();

    return (
        <div className="navbar bg-base-100 shadow-sm px-4">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {publicLinks}
                    </ul>
                </div>
                <NavLink to='/' className="text-xl text-blue-600 font-semibold flex items-center gap-2">
                    <FiPackage className='max-w-8'></FiPackage>
                    <span className='font-extrabold bg-linear-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent tracking-tight'>AssetVerse</span>
                </NavLink>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-8">
                    {publicLinks}
                </ul>
            </div>
            <div className="navbar-end">
                {user ? <div className='flex items-center gap-4'>
                    <button className="btn hover:bg-blue-50" onClick={handleLogout}>Log out</button>

                    <div className="dropdown dropdown-bottom dropdown-end dropdown-hover">
                        <img referrerPolicy='no-referrer' src={user?.photoURL} alt="" className='rounded-full max-w-10' tabIndex={0} />

                        <div tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-sm gap-2 w-52">
                            {role === 'hr' ? <>
                                <NavLink to='/dashboard/asset-list' className='btn hover:bg-blue-50'>Asset List</NavLink>
                                <NavLink to='/dashboard/add-asset' className='btn hover:bg-blue-50'>Add an Asset</NavLink>
                                <NavLink to='/dashboard/all-requests' className='btn hover:bg-blue-50'>All Requests</NavLink>
                                <NavLink to='/dashboard/my-employee-list' className='btn hover:bg-blue-50'>My Employee List</NavLink>
                                <NavLink to='/dashboard/upgrade-package' className='btn hover:bg-blue-50'>Upgrade Package</NavLink>
                                <NavLink to='/dashboard/analytics' className='btn hover:bg-blue-50'>Analytics</NavLink>
                            </> :
                                <>
                                    <NavLink to='/dashboard/my-assets' className='btn hover:bg-blue-50'>My Assets</NavLink>
                                    <NavLink to='/dashboard/request-asset' className='btn hover:bg-blue-50'>Request an Asset</NavLink>
                                    <NavLink to='/dashboard/my-team' className='btn hover:bg-blue-50'>My Team</NavLink>
                                    <NavLink to='/dashboard/profile' className='btn hover:bg-blue-50'>Profile</NavLink>
                                </>}
                        </div>
                    </div>
                </div >
                    :
                    <NavLink className='btn hover:bg-blue-50' to='/login'>Log in</NavLink>}
            </div>
        </div >
    );
};

export default Navbar;