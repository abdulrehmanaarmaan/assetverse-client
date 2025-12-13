import { AlertCircle, CircleUserRound, Clipboard, ClipboardList, ClipboardPlus, PackageCheck, PackagePlus, PieChart, Sparkles, User, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Link, NavLink, useLocation } from 'react-router';
import useLoader from '../hooks/UseLoader';
import useUserInfo from '../hooks/UseUserInfo';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

const DashboardError = () => {
    const [sidebar, openSidebar] = useState(false);

    const { role, isLoading } = useUserInfo();

    console.log(role)

    const { loader, startLoading, stopLoading } = useLoader();

    const location = useLocation()

    console.log(location)

    useEffect(() => {
        startLoading()
        const timer = setTimeout(() => stopLoading(), 700)
        return () => clearTimeout(timer)
    }, [location?.pathname])

    return (
        <div>
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Navbar */}
                    <nav className="navbar w-full bg-base-300 gap-3 shadow-sm border border-gray-300">
                        <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost hover:bg-blue-100 border-0"
                            onClick={() => openSidebar(!sidebar)}>
                            {/* Sidebar toggle icon */}
                            {!sidebar ? <PanelLeftOpen></PanelLeftOpen> : <PanelLeftClose></PanelLeftClose>}
                        </label>
                        <NavLink to='/' className="font-extrabold bg-linear-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent tracking-tight">
                            AssetVerse
                        </NavLink>
                    </nav>
                    {/* Page content here */}
                    <div className='py-12 bg-linear-to-b from-gray-50 to-gray-200 min-h-screen'>
                        {isLoading || loader ? <Loader></Loader> : <div className={`${location?.pathname === '/' ? 'pt-12' : 'py-12'} bg-linear-to-b from-gray-50 to-gray-200 min-h-screen`}>
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-center"
                            >
                                <AlertCircle className="mx-auto mb-4 h-20 w-20 text-red-500" />
                                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                                <p className="text-xl text-gray-600 mb-6">
                                    Oops! The page you are looking for does not exist.
                                </p>
                                <Link
                                    to="/dashboard"
                                    className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-400 transition-colors font-semibold"
                                >
                                    Go Back to Dashboard
                                </Link>
                            </motion.div>
                        </div>}
                        <Footer></Footer>

                    </div>
                </div>
                <div className="drawer-side is-drawer-close:overflow-visible">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                        {/* Sidebar content here */}
                        <ul className="menu w-full grow gap-3.5">
                            {/* List item */}
                            <li>
                                <NavLink to='/' className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center bg-transparent"
                                    data-tip="Home">
                                    {/* Home icon */}
                                    <House className='max-w-4'></House>
                                    <span className="is-drawer-close:hidden">Home</span>
                                </NavLink>
                            </li>
                            {/* List item */}
                            {role === 'hr' ?
                                <>
                                    <li>
                                        <NavLink to='/dashboard/asset-list' className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center bg-transparent" data-tip="Asset List">
                                            <Clipboard className='max-w-4'></Clipboard>
                                            <span className="is-drawer-close:hidden">Asset List</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/dashboard/add-asset' className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center bg-transparent" data-tip="Add an Asset">
                                            {/* Settings icon */}
                                            <PackagePlus className='max-w-4'></PackagePlus>
                                            <span className="is-drawer-close:hidden">Add an Asset</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/dashboard/all-requests' className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center bg-transparent" data-tip="All Requests">
                                            {/* Settings icon */}
                                            <ClipboardList className='max-w-4'></ClipboardList>
                                            <span className="is-drawer-close:hidden">All Requests</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/dashboard/my-employee-list' className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center bg-transparent" data-tip="My Employee List">
                                            {/* Settings icon */}
                                            <User className='max-w-4'></User>
                                            <span className="is-drawer-close:hidden">My Employee List</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/dashboard/upgrade-package' className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center bg-transparent" data-tip="Upgrade Package">
                                            {/* Settings icon */}
                                            <Sparkles className='max-w-4'></Sparkles>
                                            <span className="is-drawer-close:hidden">Upgrade Package</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/dashboard/analytics'
                                            className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center bg-transparent"
                                            data-tip="Analytics">
                                            {/* Settings icon */}
                                            <PieChart className='max-w-4'></PieChart>
                                            <span className="is-drawer-close:hidden">Analytics</span>
                                        </NavLink>
                                    </li>
                                </>
                                : <>
                                    <li>
                                        <NavLink to='/dashboard/my-assets'
                                            className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center bg-transparent"
                                            data-tip="My Assets">
                                            {/* Settings icon */}
                                            <PackageCheck className='max-w-4'></PackageCheck>
                                            <span className="is-drawer-close:hidden">My Assets</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/dashboard/request-asset'
                                            className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center bg-transparent"
                                            data-tip="Request an Asset">
                                            {/* Settings icon */}
                                            <ClipboardPlus className='max-w-4'></ClipboardPlus>
                                            <span className="is-drawer-close:hidden">Request an Asset</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/dashboard/my-team'
                                            className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center bg-transparent"
                                            data-tip="My Team">
                                            {/* Settings icon */}
                                            <Users className='max-w-4'></Users>
                                            <span className="is-drawer-close:hidden">My Team</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/dashboard/profile'
                                            className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center bg-transparent"
                                            data-tip="Profile">
                                            {/* Settings icon */}
                                            <CircleUserRound className='max-w-4'></CircleUserRound>
                                            <span className="is-drawer-close:hidden">Profile</span>
                                        </NavLink>
                                    </li>
                                </>
                            }
                        </ul>
                    </div>
                </div>
                <Toaster></Toaster>
            </div>
        </div>
    );
};

export default DashboardError;