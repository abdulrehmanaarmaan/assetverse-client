
import React, { use } from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { AuthContext } from '../contexts/AuthContext';

const Footer = () => {

    const { user } = use(AuthContext);

    return (
        <footer className="bg-white">
            <div className="max-w-7xl px-6 py-10 grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr] lg:grid-cols-[2fr_2fr_2fr_1fr] gap-8 text-center md:text-left">
                {/* Copyright */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Company</h3>
                    <p className="text-sm text-gray-600">
                        © {new Date().getFullYear()} AssetVerse. All rights reserved.
                    </p>
                </div>
                {/* Contact Details */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Contact</h3>
                    <p className="text-sm text-gray-600">Email: <a href="mailto:assetverse@yourcompany.com" className="hover:text-gray-900">assetverse@gmail.com</a></p>
                    <p className="text-sm text-gray-600">Phone: <a href="tel:+8801725348534" className="hover:text-gray-900">+880 1725 348534</a></p>
                </div>
                {/* Quick Links + Social */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                    <ul className="text-sm text-gray-600 flex flex-row flex-wrap md:flex-col md:items-start items-center gap-y-3 gap-x-5 justify-center">
                        <li><a href="/" className="hover:text-gray-900">Home</a></li>
                        <li><a href="/about" className="hover:text-gray-900">About</a></li>
                        <li><a href="/blog" className="hover:text-gray-900">Blog</a></li>
                        <li><a href="/contact" className="hover:text-gray-900">Contact</a></li>
                        {!user && <>
                            <li><a href='/registration/employee' className="hover:text-gray-900">Join as Employee</a></li>
                            <li><a href='/registration/hr-manager' className="hover:text-gray-900">Join as HR Manager</a></li>
                            <li><a href="/login" className="hover:text-gray-900">Login</a></li>
                        </>}
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-3">Social Media Links</h3>
                    <div className="flex gap-4 mt-4 items-center justify-center md:justify-start">
                        <a href='https://www.facebook.com/' target="_blank" rel="noopener noreferrer" className='p-2 rounded-full hover:bg-gray-200 transition'><FaFacebookF /></a>
                        <a href='https://www.instagram.com/' target="_blank" rel="noopener noreferrer" className='p-2 rounded-full hover:bg-gray-200 transition'><FaInstagram /></a>
                        <a href='https://www.linkedin.com/' target="_blank" rel="noopener noreferrer" className='p-2 rounded-full hover:bg-gray-200 transition'><FaLinkedinIn /></a>
                    </div >
                </div>
            </div >
        </footer >

    );
};

export default Footer;