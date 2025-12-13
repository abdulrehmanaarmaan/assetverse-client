
import React from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t mt-10">
            <div className="max-w-7xl px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 justify-between mx-auto">
                {/* Copyright */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Company</h3>
                    <p className="text-sm text-gray-600">
                        © {new Date().getFullYear()} Your Company Name. All rights reserved.
                    </p>
                </div>
                {/* Contact Details */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Contact</h3>
                    <p className="text-sm text-gray-600">Email: support@yourcompany.com</p>
                    <p className="text-sm text-gray-600">Phone: +1 234 567 890</p>
                </div>
                {/* Quick Links + Social */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><a href="/" className="hover:text-gray-900">Home</a></li>
                        <li><a href='/registration/employee' className="hover:text-gray-900">Join as Employee</a></li>
                        <li><a href='/registration/hr-manager' className="hover:text-gray-900">Join as HR Manager</a></li>
                    </ul>
                    {/* <div className="flex gap-4 mt-4"> */}
                    {/* <a href="#" className="p-2 rounded-full hover:bg-gray-200 transition"> */}
                    {/* <i className="fab fa-facebook-f"></i> */}
                    {/* </a> */}
                    {/* <a href="#" className="p-2 rounded-full hover:bg-gray-200 transition"> */}
                    {/* <i className="fab fa-twitter"></i> */}
                    {/* </a> */}
                    {/* <a href="#" className="p-2 rounded-full hover:bg-gray-200 transition"> */}
                    {/* <i className="fab fa-linkedin-in"></i> */}
                    {/* </a> */}
                    {/* </div> */}
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-3">Social Media Links</h3>
                    <div className="flex gap-4 mt-4 items-center">
                        <a href='https://www.facebook.com/'><FaFacebookF /></a>
                        <a href='https://www.instagram.com/'><FaInstagram /></a>
                        <a href='https://www.linkedin.com/'><FaLinkedinIn /></a>
                    </div >
                </div>
            </div >
        </footer >

    );
};

export default Footer;