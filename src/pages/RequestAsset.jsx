import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAxiosSecure from '../hooks/UseAxiosSecure';
import useLoader from '../hooks/UseLoader';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import useUserInfo from '../hooks/UseUserInfo';
// import { AuthContext } from '../contexts/AuthContext';

const RequestAsset = () => {

    const axiosInstanceSecure = useAxiosSecure();

    const { data: assets = [], isLoading } = useQuery({
        queryKey: ['assets'],
        queryFn: async () => {
            const result = await axiosInstanceSecure.get('/assets')
            return result?.data
        }
    })

    const { name, email } = useUserInfo()

    const { data: requests = [], refetch } = useQuery({
        queryKey: ['requests'],
        queryFn: async () => {
            const result = await axiosInstanceSecure.get(`/requests?requesterEmail=${email}`)
            return result?.data
        }
    })

    const requestedAssetsIds = requests.map(request => request?.assetId)

    const [selectedAsset, setSelectedAsset] = useState({})

    const { loader, startLoading, stopLoading } = useLoader()

    const handleRequest = event => {

        event.preventDefault()

        const note = event.target.note.value;

        startLoading()

        const requestInfo = {
            assetId: selectedAsset?._id,
            assetName: selectedAsset?.productName,
            assetType: selectedAsset?.productType,
            requesterName: name,
            requesterEmail: email,
            hrEmail: selectedAsset?.hrEmail,
            companyName: selectedAsset?.companyName,
            requestDate: new Date(),
            approvalDate: null,
            requestStatus: 'pending',
            note: note,
            processedBy: selectedAsset?.hrEmail
        }

        axiosInstanceSecure.post('/requests', requestInfo)
            .then(res => {
                refetch()

                console.log(res)

                stopLoading()
                toast.success('Submitted successfully')
            })
            .catch(err => {
                console.log(err)
                stopLoading()
                toast.error('Failed to submit')
            })
    }

    if (loader) return <Loader></Loader>

    const assetsMoreThanZero = assets.filter(asset => asset?.productQuantity > 0);

    return (
        <div>
            <h1 className='text-3xl font-semibold text-gray-800 tracking-tight text-center mb-6'>Request an Asset</h1>
            {assetsMoreThanZero.length > 0 ? < p className='text-2xl font-bold mb-6 text-center text-gray-600'>Choose an available request and submit an asset</p>
                : < h1 className='text-2xl font-bold mb-6 text-center text-gray-600'>No assets added yet</h1>}
            <div className='grid grid-cols-3 gap-6 max-w-[1300px] mx-auto px-4'>
                {isLoading ? <Loader></Loader> :
                    assetsMoreThanZero.map(asset =>
                        <div key={asset?._id} className='card bg-base-100 shadow-lg border border-gray-200'>
                            <figure>
                                <img src={asset?.productImage} alt={asset?.productName} className='h-40 object-cover w-full' />
                            </figure>
                            <div className='card-body text-center justify-center'>
                                <h2 className='font-bold text-xl'>{asset?.productName}</h2>
                                <p className={`badge p-3 mx-auto ${asset?.productType === 'Returnable'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                    }`}>{asset?.productType}</p>
                                <p className='text-gray-600 text-sm'>
                                    Available: {asset?.productQuantity}
                                </p>
                                <button className={`btn mt-3 ${requestedAssetsIds.includes(asset?._id) ? 'bg-gray-200 text-gray-500 uppercase tracking-wide cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-400'}`} onClick={() => {
                                    setSelectedAsset(asset)
                                    document.getElementById("requestModal").showModal()
                                }} disabled={requestedAssetsIds.includes(asset?._id)}>{requestedAssetsIds.includes(asset?._id) ? 'Already Requested' : 'Request'}</button>
                                <dialog id={"requestModal"} className="modal modal-bottom sm:modal-middle">
                                    <div className="modal-box">
                                        <h3 className="font-bold text-xl mb-3 text-center">
                                            Request: {selectedAsset?.productName}
                                        </h3>
                                        <form onSubmit={handleRequest}>
                                            <label className="label mb-2">Note (required)</label>
                                            <textarea
                                                name="note"
                                                className="textarea textarea-bordered w-full mb-4"
                                                placeholder="Add a note for the admin..."
                                                required
                                                minLength={10}
                                                maxLength={300}
                                            ></textarea>
                                            <button className="btn bg-blue-500 hover:bg-blue-400 w-full text-white">
                                                Submit Request
                                            </button>
                                        </form>
                                        <div className="modal-action">
                                            <button className="btn" onClick={() => document.getElementById("requestModal").close()}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </dialog>
                            </div>
                        </div>
                    )
                }
            </div>

        </div >
    );
};

export default RequestAsset;




