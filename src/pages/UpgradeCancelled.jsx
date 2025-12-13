import { XCircle } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router';

const UpgradeCancelled = () => {
    return (
        <div>
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white border border-gray-300 rounded-2xl shadow-sm p-6 text-center">

                    <XCircle className="mx-auto text-red-500 w-14 h-14 mb-4" />

                    <h1 className="text-2xl font-semibold text-gray-800">
                        Payment Cancelled
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Your payment was cancelled. No charges were made to your account.
                    </p>

                    <p className="text-sm text-gray-500 mt-3">
                        You can retry upgrading your package or return to your dashboard.
                    </p>

                    <div className="mt-6 flex gap-3 justify-center">
                        <NavLink
                            to="/dashboard/upgrade-package"
                            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-400 transition font-semibold"
                        >
                            Retry Upgrade
                        </NavLink>

                        <NavLink
                            to="/dashboard/asset-list"
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-semibold"
                        >
                            Go to Dashboard
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpgradeCancelled;