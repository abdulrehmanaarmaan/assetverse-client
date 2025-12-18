import { AlertCircle } from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';

const DashboardError = () => {

    const navigate = useNavigate();

    const handleGoBack = () => {

        if (window.history.length) {
            navigate(-1)
        }

        else {
            navigate('/')
        }
    }

    return (
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
                className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-400 transition-colors font-semibold"
                onClick={handleGoBack}>
                Go Back
            </Link>
        </motion.div>
    );
};

export default DashboardError;