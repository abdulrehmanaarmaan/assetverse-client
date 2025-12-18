import { BarChart2, CheckCircle, Layers, Shield, Users, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import useUserInfo from '../hooks/UseUserInfo';
import { use, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router';
import useAxios from '../hooks/UseAxios';

const Home = () => {

    const axiosInstance = useAxios()

    const { data: pkgs = [], isLoading } = useQuery({
        queryKey: ['packages'],
        queryFn: async () => {
            const result = await axiosInstance.get(`/packages`)
            return result?.data
        }
    })

    const { user } = use(AuthContext)

    const { role } = useUserInfo()

    const navigate = useNavigate()

    const handlePayment = () => {
        if (!user || role !== 'hr') {
            document.getElementById('my_modal_5').showModal()
        }

        else {
            navigate('/dashboard/upgrade-package')
        }
    }

    const handleGetStarted = () => {
        if (!user) {
            navigate('/login')
        }

        if (role === 'hr') {
            navigate('/dashboard/asset-list')
        }

        if (role === 'employee') {
            navigate('/dashboard/request-asset')
        }
    }

    return (
        <div>
            <div className="w-full overflow-hidden">

                <section className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-4xl md:text-6xl font-bold text-gray-900"
                    >
                        Manage Assets & Teams With Confidence
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="mt-4 max-w-2xl text-lg text-gray-600"
                    >
                        AssetVerse helps companies track assets, manage employees, and streamline workflow — all in one dashboard.
                    </motion.p>
                    <motion.button
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-6 px-8 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-lg shadow-md cursor-pointer font-semibold"
                        onClick={handleGetStarted}>
                        Get Started
                    </motion.button>
                </section>

                <section className="py-20 px-6 bg-gray-50">
                    <h2 className="text-3xl font-semibold text-gray-800 tracking-tight mb-6 text-center">Why Choose AssetVerse?</h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-300">
                            <Users className="h-10 w-10 text-blue-600 mb-4" />
                            <h3 className="font-semibold text-lg mb-2">Easy Employee Management</h3>
                            <p className="text-gray-600 text-sm">Manage teams, assign assets, track responsibilities.</p>
                        </div>
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-300">
                            <Shield className="h-10 w-10 text-blue-600 mb-4" />
                            <h3 className="font-semibold text-lg mb-2">Secure & Reliable</h3>
                            <p className="text-gray-600 text-sm">Your data is protected with enterprise-grade security.</p>
                        </div>
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-300">
                            <BarChart2 className="h-10 w-10 text-blue-600 mb-4" />
                            <h3 className="font-semibold text-lg mb-2">Smart Analytics</h3>
                            <p className="text-gray-600 text-sm">Track usage insights and performance automatically.</p>
                        </div>
                    </div>
                </section>

                <section className="py-20 px-6">
                    <h2 className="text-3xl font-semibold text-gray-800 tracking-tight mb-6 text-center">Choose Your Plan</h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {isLoading ? <Loader></Loader> : pkgs.map((pkg, index) => <motion.div
                            key={pkg.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="p-8 border rounded-xl shadow-sm hover:shadow-md transition bg-white border-gray-300 flex flex-col"
                        >
                            <h3 className="text-xl font-bold text-center">{pkg.name}</h3>
                            <p className="mt-1 text-center text-gray-600">{pkg?.name === 'Basic' ? 5 : pkg?.name === 'Standard' ? 10 : 20} Employees</p>
                            <p className="text-4xl font-bold text-center mt-4">${pkg.price}<span className="text-sm">/month</span></p>
                            <ul className="mt-6 space-y-3 mb-6">
                                {pkg.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-2 text-gray-700">
                                        <CheckCircle className="h-5 w-5 text-green-600" /> {f}
                                    </li>
                                ))}
                            </ul>

                            <div className='mt-auto'>
                                <button className="w-full py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-semibold hover:cursor-pointer" onClick={handlePayment}>
                                    Get Started
                                </button>
                            </div>

                            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg">{!user ? 'Login Required' : 'Access Restricted'}</h3>
                                    <p className="py-4">{!user ? 'You must be logged in to access this feature.' : 'Only HR users can purchase packages.'}</p>
                                    <div className="modal-action">
                                        <form method="dialog">
                                            {/* if there is a button in form, it will close the modal */}
                                            <button className="btn hover:bg-blue-50">Cancel</button>
                                        </form>
                                    </div>
                                </div>
                            </dialog>
                        </motion.div>)}
                    </div>
                </section>

                <section className="py-20 px-6 bg-gray-50">
                    <h2 className="text-3xl font-semibold text-gray-800 tracking-tight mb-6 text-center">Core Features</h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            { icon: Zap, title: "Fast Operations", desc: "Smooth and optimized workflow experience." },
                            { icon: Layers, title: "All-in-One Dashboard", desc: "Everything you need in one clean interface." },
                            { icon: BarChart2, title: "Real-Time Insights", desc: "Track asset usage and team activity instantly." },
                            { icon: Shield, title: "Role-Based Access", desc: "Admins, HRs, and Employees get different dashboards." },
                            { icon: Users, title: "Team Collaboration", desc: "Connect and work together seamlessly." },
                            { icon: CheckCircle, title: "Auto Tracking", desc: "Asset assignment & return tracking made easy." },
                        ].map((feature, i) => (
                            <div key={i} className="p-6 bg-white rounded-xl border shadow-sm border-gray-300">
                                <feature.icon className="h-10 w-10 text-blue-600 mb-4" />
                                <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="py-20 px-6 text-center">
                    <h2 className="text-3xl font-semibold text-gray-800 tracking-tight mb-6 text-center">Trusted by Companies Worldwide</h2>
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {[
                            ["100+", "Companies Active"],
                            ["10K+", "Assets Tracked"],
                            ["5000+", "Employees Managed"],
                        ].map(([num, label], i) => (
                            <div key={i} className="p-8 border rounded-xl shadow-sm bg-white border-gray-300">
                                <h3 className="text-4xl font-bold text-blue-600">{num}</h3>
                                <p className="text-gray-600 mt-2">{label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="py-20 px-6 bg-gray-50">
                    <h2 className="text-3xl font-semibold text-gray-800 tracking-tight mb-6 text-center">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
                        {[
                            { step: "1", title: "Create Your Company", desc: "Set up your organization and HR access." },
                            { step: "2", title: "Add Employees & Assets", desc: "Assign assets with a single click." },
                            { step: "3", title: "Track Everything", desc: "Monitor status, returns, and requests." },
                        ].map((item, i) => (
                            <div key={i} className="bg-white border p-8 rounded-xl shadow-sm border-gray-300">
                                <div className="text-blue-600 text-5xl font-bold mb-4">{item.step}</div>
                                <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="py-20 px-6">
                    <h2 className="text-3xl font-semibold text-gray-800 tracking-tight mb-6 text-center">Frequently Asked Questions</h2>
                    <div className="max-w-3xl mx-auto space-y-6">
                        {[
                            ["Is AssetVerse free to start?", "Yes! You can explore all basic features for free."],
                            ["Can I upgrade anytime?", "Yes, HRs can upgrade plans instantly using Stripe."],
                            ["Are my files and data safe?", "All data is encrypted and access-controlled."],
                        ].map(([q, a], i) => (
                            <div key={i} className="border rounded-xl p-6 bg-gray-50 border-gray-300">
                                <h3 className="font-semibold text-lg">{q}</h3>
                                <p className="text-gray-600 mt-2">{a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="py-20 px-6 text-center bg-blue-600 text-white">
                    <h2 className="text-3xl font-semibold tracking-tight mb-6 text-center">Ready to Modernize Your Workflow?</h2>
                    <p className="mb-6">Let AssetVerse streamline your assets and team management today.</p>
                    {/* <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-200"> */}
                    {/* Contact Us */}
                    {/* </button> */}
                </section>
            </div >
        </div >
    );
};

export default Home;