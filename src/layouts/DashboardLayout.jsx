import { CircleUserRound, Clipboard, ClipboardList, ClipboardPlus, House, PackageCheck, PackagePlus, PanelLeftClose, PanelLeftOpen, PieChart, Sparkles, User, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import useUserInfo from '../hooks/UseUserInfo';
import { Toaster } from 'react-hot-toast';

const DashboardLayout = () => {

    const [sidebar, openSidebar] = useState(false);

    const { role } = useUserInfo();
    console.log(role)

    const location = useLocation()

    console.log(location)

    useEffect(() => {
        const checkbox = document.getElementById('my-drawer-4');
        if (!checkbox) return;
        const handleChange = () => openSidebar(checkbox.checked);
        checkbox.addEventListener('change', handleChange);
        return () => checkbox.removeEventListener('change', handleChange);
    }, []);

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Navbar */}
                <nav className="navbar w-full bg-base-300 gap-3 shadow-sm border border-gray-300">
                    <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost hover:bg-blue-100 border-0" onClick={() => openSidebar(!sidebar)}>
                        {/* Sidebar toggle icon */}
                        {!sidebar ? <PanelLeftOpen></PanelLeftOpen> : <PanelLeftClose></PanelLeftClose>}
                    </label>

                    <NavLink to='/' className="font-extrabold bg-linear-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent tracking-tight">
                        AssetVerse
                    </NavLink>
                </nav>
                {/* Page content here */}
                <div className={`py-12 bg-linear-to-b from-gray-50 to-gray-200 min-h-screen`}>
                    <Outlet></Outlet>
                </div>
            </div>

            <div className="drawer-side is-drawer-close:overflow-visible">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                    {/* Sidebar content here */}
                    <ul className="menu w-full grow gap-3.5">
                        {/* List item */}
                        <li>
                            <NavLink to='/' className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center bg-transparent" data-tip="Home">
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
                                        className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center bg-transparent" data-tip="My Assets">
                                        {/* Settings icon */}
                                        <PackageCheck className='max-w-4'></PackageCheck>
                                        <span className="is-drawer-close:hidden">My Assets</span>
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to='/dashboard/request-asset'
                                        className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center bg-transparent" data-tip="Request an Asset">
                                        {/* Settings icon */}
                                        <ClipboardPlus className='max-w-4'></ClipboardPlus>
                                        <span className="is-drawer-close:hidden">Request an Asset</span>
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to='/dashboard/my-team'
                                        className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center bg-transparent" data-tip="My Team">
                                        {/* Settings icon */}
                                        <Users className='max-w-4'></Users>
                                        <span className="is-drawer-close:hidden">My Team</span>
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to='/dashboard/profile'
                                        className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center bg-transparent" data-tip="Profile">
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
    );
};

export default DashboardLayout;