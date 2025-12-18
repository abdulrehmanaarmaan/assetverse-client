import React, { useState } from 'react';
import useAxiosSecure from '../hooks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Loader from '../components/Loader';

const MyTeam = () => {

    const axiosInstanceSecure = useAxiosSecure();

    const [selectedCompany, setSelectedCompany] = useState('Pick a company')

    const { data: hrs = [] } = useQuery({
        queryKey: ['users', 'hr'],
        queryFn: async () => {
            const result = await axiosInstanceSecure.get(`/users?role=${'hr'}`)
            return result?.data
        }
    })

    console.log(hrs)

    const { data: affiliationsPerCompany = [] } = useQuery({
        queryKey: ['affiliations', selectedCompany],
        queryFn: async () => {
            const result = await axiosInstanceSecure.get(`/affiliations?companyName=${selectedCompany}`)
            return result?.data
        }
    })

    console.log(affiliationsPerCompany)

    const affiliatedEmployeesEmail = affiliationsPerCompany.map(affiliation => affiliation?.employeeEmail);

    console.log(affiliatedEmployeesEmail)

    const { data: employees = [], isLoading } = useQuery({
        queryKey: ['role', 'employee'],
        queryFn: async () => {
            const result = await axiosInstanceSecure.get(`/users?role=${'employee'}`)
            return result?.data
        }
    })

    const affiliatedEmployees = employees.filter(employee => affiliatedEmployeesEmail.includes(employee?.email))

    console.log(affiliatedEmployees)

    const currentMonth = new Date().getMonth() + 1;

    console.log(currentMonth)

    const upcomingBirthdayEmployees = affiliatedEmployees.filter(employee => new Date(employee?.dateOfBirth).getMonth() + 1 === currentMonth)

    return (
        <div>
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                {/* Page Title */}
                <h1 className="text-3xl font-semibold text-gray-800 tracking-tight mb-6 text-center">My Team</h1>
                {/* Company Selection */}
                <div className="flex justify-center mb-15">
                    {hrs.length > 0 ? <select
                        className="select select-bordered px-4 py-2 text-lg hover:cursor-pointer"
                        onChange={(event) => setSelectedCompany(event.target.value)}
                        defaultValue='Pick a company'
                        disabled={isLoading}
                    >
                        <option value='Pick a company' disabled>Pick a company</option>
                        {hrs.map(hr => (
                            <option key={hr?._id} value={hr?.companyName}>
                                {hr?.companyName}
                            </option>
                        ))}
                    </select>
                        : <h2 className="text-2xl font-bold text-center text-gray-600">No HRs available yet</h2>}
                </div>
                {/* Colleagues List */}
                {selectedCompany !== 'Pick a company' &&
                    <>
                        {affiliatedEmployees.length > 0 ? <h2 className="text-2xl font-bold mb-6 text-center text-gray-600">
                            Colleagues at {selectedCompany}
                        </h2> : <p className="text-2xl font-bold mb-6 text-center text-gray-600">No team members yet</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {isLoading ? <Loader></Loader> : affiliatedEmployees.map((employee, index) => (
                                <div
                                    key={employee?._id}
                                    className="card bg-base-100 shadow-lg border border-gray-200 rounded-xl"
                                >
                                    <div className="p-6 text-center">
                                        <img
                                            src={employee?.profileImage}
                                            alt={employee?.name}
                                            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                                        />
                                        <h3 className="text-lg font-bold">{employee?.name}</h3>
                                        <p className="text-gray-500 text-sm">{employee?.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                }
                {/* Upcoming Birthdays */}
                {affiliatedEmployees.length > 0 &&
                    <div className="mt-15">
                        <h2 className=" text-2xl font-bold mb-6 text-center text-gray-600">
                            🎉 Upcoming Birthdays This Month
                        </h2>
                        {upcomingBirthdayEmployees.length === 0 ? (
                            <p className="text-2xl font-bold mb-6 text-center text-gray-600">No upcoming birthdays this month.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {isLoading ? <Loader></Loader> : upcomingBirthdayEmployees.map(employee => (
                                    <div
                                        key={employee._id}
                                        className="card bg-indigo-50 border border-indigo-200 shadow-sm rounded-xl p-5"
                                    >
                                        <div className="text-center">
                                            <img
                                                src={employee?.profileImage}
                                                alt={employee?.name}
                                                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-indigo-300"
                                            />
                                            <h3 className="text-lg font-bold text-indigo-800">
                                                {employee?.name}
                                            </h3>
                                            <p className="text-gray-600">{employee?.email}</p>
                                            <p className="mt-2 text-indigo-700 font-medium">
                                                🎂 {new Date(employee?.dateOfBirth).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>}
            </div>
        </div >
    );
};

export default MyTeam;
