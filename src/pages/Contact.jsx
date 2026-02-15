import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {

    return (
        <div className="w-full overflow-hidden">

            {/* Hero Section */}
            <section className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6 bg-gray-50">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-6xl font-bold text-gray-900"
                >
                    Contact Us
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-4 max-w-3xl text-lg text-gray-600"
                >
                    Have questions about AssetVerse, pricing, or support?
                    We’re here to help.
                </motion.p>
            </section>

            {/* Contact Info Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                    <div className="p-6 bg-white rounded-xl border border-gray-300 shadow-sm text-center">
                        <Mail className="h-10 w-10 mx-auto text-blue-600 mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Email</h3>
                        <p className="text-gray-600 text-sm">
                            assetverse@gmail.com
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-xl border border-gray-300 shadow-sm text-center">
                        <Phone className="h-10 w-10 mx-auto text-blue-600 mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Phone</h3>
                        <p className="text-gray-600 text-sm">
                            +880 1725 348534
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-xl border border-gray-300 shadow-sm text-center">
                        <MapPin className="h-10 w-10 mx-auto text-blue-600 mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Location</h3>
                        <p className="text-gray-600 text-sm">
                            Chittagong, Bangladesh
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-20 px-6 bg-gray-50">
                <h2 className="text-gray-800 mb-6 text-center text-3xl font-semibold tracking-tight">
                    Send Us a Message
                </h2>
                <div className="max-w-3xl mx-auto bg-base-100 p-8 rounded-xl border border-gray-300 shadow-sm">
                    <form className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Your Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-[#d1d5db]"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-[#d1d5db]"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Message
                            </label>
                            <textarea
                                rows="4"
                                placeholder="Write your message"
                                className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-[#d1d5db]"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-semibold transition cursor-pointer"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </section>

            {/* CTA Footer Section */}
            <section className="py-20 px-6 text-center bg-blue-600 text-white">
                <h2 className="text-3xl font-semibold tracking-tight mb-6">
                    We’re Here to Support You
                </h2>
                <p className="max-w-2xl mx-auto">
                    Whether you’re an HR, employee, or company admin —
                    AssetVerse support is just a message away.
                </p>
            </section>

        </div>
    );
};

export default Contact;
