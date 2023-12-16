import { ChangeEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from "@/hooks/useAppHooks";
import { usePhotoUploadMutation } from "@/slices/userApiSlice";
import { useGetProfilePictureQuery } from '@/slices/userApiSlice';
import { useEffect } from 'react';
const AccountEdit = () => {
    const userInfo = useAppSelector((state) => state.auth.userInfo);
    const [uploadPhoto, { isLoading, isError }] = usePhotoUploadMutation();
    const { data: profilePhoto, isFetching, isLoading: isProfileLoading, isError: isProfileError, refetch } = useGetProfilePictureQuery()
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setSelectedFile(file);
            } else {
                console.error('Please select an image file.');
            }
        }
    };
    interface FormDataWithPhoto extends FormData {
        photo: File;
    }

    const handleUpload = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('photo', selectedFile, selectedFile.name);

            uploadPhoto(formData as FormDataWithPhoto);
        } else {
            console.error('Please select a file to upload.');
        }
    };

    useEffect(() => {
        if (profilePhoto)
            refetch()
        console.log("image response", profilePhoto?.response)
    }, [profilePhoto, refetch])






    return (
        <div className="max-w-lg mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Account Information</h2>
            {/* <div className="mb-4">
                <input
                    type="file"
                    accept="image/*" // Accept only image files
                    onChange={handleFileChange}
                    className="border border-gray-300 rounded px-3 py-2"
                />
            </div>
            <div>
                <button
                    onClick={handleUpload}
                    disabled={!selectedFile || isLoading}
                    className={`bg-blue-500 text-white px-4 py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                >
                    {isLoading ? 'Uploading...' : 'Upload Photo'}
                </button>
                {isError && <div className="text-red-500">Error uploading photo. Please try again.</div>}
            </div> */}
            <div className="mt-4">
                {/* Display user email and username */}
                <span className="text-gray-600 font-bold">Email:</span> {userInfo?.email}
                <br></br>
                <span className="text-gray-600 font-bold">Username:</span> {userInfo?.username}
            </div>
            {/* {profilePhoto && 'response' in profilePhoto && 'file' in profilePhoto.response ? (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Profile Picture</h3>
                    <img
                        src={URL.createObjectURL(profilePhoto.response.file)}
                        alt="Profile"
                        className="mt-2 max-w-xs"
                    />
                </div>
            ) : (
                <p>No profile picture available</p>
            )}  */}
        </div>
    );
};

export default AccountEdit;
