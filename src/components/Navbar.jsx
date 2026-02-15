// import React, { use } from 'react';
import { NavLink } from 'react-router';
import { AuthContext } from '../contexts/AuthContext';
import { use } from 'react';
import { FiMoon, FiPackage, FiSun } from 'react-icons/fi';
import useUserInfo from '../hooks/UseUserInfo';
import { ThemeContext } from '../contexts/ThemeContext';

const Navbar = () => {

    const { user, logout } = use(AuthContext);

    const { darkMode, setDarkMode } = use(ThemeContext);

    const publicLinks = <>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/about'>About</NavLink>
        <NavLink to='/blog'>Blog</NavLink>
        <NavLink to='/contact'>Contact</NavLink>
        {!user && <>
            <NavLink to='/registration/employee'>Join as Employee</NavLink>
            <NavLink to='/registration/hr-manager'>Join as HR Manager</NavLink>
        </>}

        <div className='border border-base-300 my-1 md:hidden'></div>

        <div className="px-3 py-2 hover:bg-base-200 rounded-lg md:hidden transition-all duration-200 hover:text-black">
            <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium">

                    {darkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
                    Theme
                </span>
                <button onClick={() => setDarkMode(!darkMode)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${darkMode ? "bg-blue-600 cursor-pointer" : "bg-base-300 cursor-pointer"}`} aria-label="Toggle theme">

                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${darkMode ? "translate-x-5" : "translate-x-1"}`}
                    />
                </button>
            </div>
        </div>
    </>

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
        <div className="navbar bg-base-100 border-b border-base-300 px-4 sticky top-0 z-1">
            <div className="navbar-start gap-4">
                <NavLink to='/' className="text-xl text-blue-600 font-semibold flex items-center gap-2">
                    <FiPackage className='w-8 h-8'></FiPackage>
                    <span className='font-extrabold bg-linear-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent tracking-tight'>AssetVerse</span>
                </NavLink>

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn lg:hidden hamburger-menu">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow gap-1">
                        {publicLinks}
                    </ul>
                </div>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-8">
                    {publicLinks}
                </ul>
            </div>
            <div className="navbar-end">
                <button onClick={() => setDarkMode(!darkMode)} className='btn btn-circle mr-4 navbar-btn hidden md:flex' id='theme-toggler'
                    aria-label='Toggle theme'>{darkMode ? <FiSun className='w-5 h-5'></FiSun> : <FiMoon className='w-5 h-5'></FiMoon>}</button>

                {user ? <div className='flex items-center gap-4'>

                    <button className="btn md:inline-flex hidden navbar-btn" onClick={handleLogout}>Log out</button>

                    <div className="dropdown dropdown-bottom dropdown-end">
                        <img referrerPolicy='no-referrer' src={user?.photoURL} alt="" className='rounded-full w-10 h-10 hover:cursor-pointer object-cover' tabIndex={0} />

                        <div tabIndex="-1" className="dropdown-content menu menu-sm bg-base-100 rounded-box z-1 shadow gap-1 w-52 p-2 mt-3">
                            {role === 'hr' ? <>
                                <NavLink to='/dashboard/asset-list' className='hover:bg-blue-50'>Asset List</NavLink>
                                <NavLink to='/dashboard/add-asset' className='hover:bg-blue-50'>Add an Asset</NavLink>
                                <NavLink to='/dashboard/all-requests' className='hover:bg-blue-50'>All Requests</NavLink>
                                <NavLink to='/dashboard/my-employee-list' className='hover:bg-blue-50'>My Employee List</NavLink>
                                <NavLink to='/dashboard/upgrade-package' className='hover:bg-blue-50'>Upgrade Package</NavLink>
                                <NavLink to='/dashboard/analytics' className='hover:bg-blue-50'>Analytics</NavLink>
                            </> :
                                <>
                                    <NavLink to='/dashboard/my-assets' className='hover:bg-blue-50'>My Assets</NavLink>
                                    <NavLink to='/dashboard/request-asset' className='hover:bg-blue-50'>Request an Asset</NavLink>
                                    <NavLink to='/dashboard/my-team' className='hover:bg-blue-50'>My Team</NavLink>
                                </>}
                            <NavLink to='/dashboard/profile' className='hover:bg-blue-50'>Profile</NavLink>

                            <div className='border md:border-none my-1 md:hidden'></div>

                            <button className="btn md:hidden navbar-btn" onClick={handleLogout}>Log out</button>
                        </div>
                    </div>
                </div >
                    :
                    <NavLink className='login-btn btn hover:bg-blue-50' to='/login'>Log in</NavLink>}
            </div>
        </div >
    );
};

export default Navbar;