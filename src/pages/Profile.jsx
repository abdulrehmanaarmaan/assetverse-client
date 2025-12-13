import { AuthContext } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import useUserInfo from '../hooks/UseUserInfo';
import useAxiosSecure from '../hooks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { use } from 'react';
import axios from 'axios';
import useLoader from '../hooks/UseLoader';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const Profile = () => {

    const { handleSubmit, register, formState: { errors } } = useForm()

    const { user, updateUserInfo, setUser } = use(AuthContext)

    const axiosInstanceSecure = useAxiosSecure();

    const { email, name, profileImage, refetch } = useUserInfo()

    const { loader, startLoading, stopLoading } = useLoader()

    const handleUpdateProfile = data => {
        startLoading()
        console.log('data', data)

        let profile = '';

        if (data?.profileImage.length !== 0) {

            const profileImg = data?.profileImage[0]

            const form = new FormData()
            form.append('image', profileImg)

            const image_API_URL = `https://api.imgbb.com/1/upload?expiration=600&key=${import.meta.env.VITE_image_host_key}`;

            axios.post(image_API_URL, form)
                .then(res => {
                    console.log(res?.data)

                    const profileImgUrl = res?.data?.data?.display_url;

                    profile = profileImgUrl

                    const updatedUser = { ...user, displayName: data?.profileName, photoURL: profile }

                    updateUserInfo(updatedUser)
                        .then(() => {
                            setUser(updatedUser)

                            console.log('profile updated')

                            const { displayName, photoURL } = updatedUser

                            const updatedProfile = {
                                name: displayName,
                                profileImage: photoURL
                            }

                            axiosInstanceSecure.patch(`/users?email=${user?.email}`, updatedProfile)
                                .then(res => {
                                    console.log(res?.data)
                                    stopLoading()

                                    if (res?.data?.modifiedCount !== 0) {
                                        refetch()
                                        toast.success('Updated successfully')
                                        // refetch()
                                    }
                                    else {
                                        toast.error('No changes in update')
                                    }
                                })
                                .catch(err => {
                                    console.log(err)
                                    stopLoading()
                                    toast.error('Failed to update')
                                })
                        }
                        )
                        .catch(err => {
                            console.log(err)
                            stopLoading()
                            toast.error('Failed to update')
                        })
                })
                .catch(err => {
                    console.log(err)
                    stopLoading()
                    toast.error('Failed to update')
                })
        }

        else {

            profile = user?.photoURL

            const updatedUser = {
                ...user,
                displayName: data?.profileName,
                photoURL: profile, // Keep the existing photo URL
            }

            console.log('updated form', updatedUser)

            updateUserInfo(updatedUser)
                .then(() => {
                    setUser(updatedUser)

                    console.log('profile updated')

                    const { displayName, photoURL } = updatedUser

                    console.log(updatedUser, 'updated google')

                    const updatedProfile = {
                        name: displayName,
                        profileImage: photoURL
                    }

                    axiosInstanceSecure.patch(`/users?email=${user?.email}`, updatedProfile)
                        .then(res => {
                            console.log(res?.data)
                            stopLoading()
                            if (res?.data?.modifiedCount !== 0) {
                                refetch()
                                toast.success('Updated successfully')
                                // refetch()
                            }
                            else {
                                toast.error('No changes in update')
                            }
                        })
                        .catch(err => {
                            console.log(err)
                            stopLoading()
                            toast.error('Failed to update')
                        })
                }
                )
                .catch(err => {
                    console.log(err)
                    stopLoading()
                    toast.error('Failed to update')
                })
        }
    }

    const { data: affiliationsPerEmployee = [], isLoading } = useQuery({
        queryKey: ['affiliations', email],
        queryFn: async () => {
            const result = await axiosInstanceSecure.get(`/affiliations?employeeEmail=${email}`)
            return result?.data
        }
    })

    if (loader) return <Loader />

    return (
        <div className='px-5'>
            <h1 className='text-3xl font-semibold text-gray-800 tracking-tight mb-6 text-center'>My Profile</h1>
            <div className="hero">
                <div className="card bg-base-100 shrink-0 border border-gray-300">
                    <div className="card-body">
                        <form onSubmit={handleSubmit(handleUpdateProfile)}>
                            <fieldset className="fieldset grid-cols-1 gap-4">
                                <div>
                                    <label className="label mb-1">Email</label>
                                    <input type="email" className="input rounded-lg w-full cursor-not-allowed" readOnly defaultValue={email} />
                                </div>
                                <div>
                                    <label className="label mb-1">Full Name</label>
                                    <input type="text" className="input rounded-lg w-full" defaultValue={name} {...register('profileName', { required: true })} />
                                </div>
                                <div>
                                    <label className="label mb-1">Profile Photo</label>
                                    <input type="file" accept="image/*" className="file-input block rounded-lg w-full" {...register('profileImage')} />
                                    <img src={profileImage} alt="" className='max-w-6 rounded-full mt-3' />
                                </div>
                            </fieldset>
                            {Object.values(errors).some(err => err.type === 'required') && <p
                                className='text-red-500 mt-2'>All fields are required.</p>}
                            <button className="btn bg-blue-500 mt-3 w-full text-white hover:bg-blue-400 rounded-lg">Update Profile</button>
                        </form>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-center text-gray-600">Company Affiliations</h2>

            {affiliationsPerEmployee.length === 0 ?
                <p className="text-gray-500 text-center">You are not affiliated with any company.</p>
                :
                <div className="card bg-base-100 border shadow-md border-gray-300">
                    <div className="card-body space-y-3">
                        {isLoading ? <Loader></Loader> : affiliationsPerEmployee.map(affiliation => (
                            <div
                                key={affiliation?._id}
                                className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center shadow-sm"
                            >
                                <img src={affiliation?.companyLogo} alt={affiliation?.companyLogo} className='w-12 h-12 rounded-full object-cover' referrerPolicy='no-referrer' />

                                <div>
                                    <p className="font-semibold">{affiliation?.companyName}</p>
                                    <p className="text-gray-600 text-sm">HR: {affiliation?.hrEmail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    );
};

export default Profile;
