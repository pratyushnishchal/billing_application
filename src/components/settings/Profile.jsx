import { useEffect, useState } from 'react';
import { User } from "lucide-react";
import SettingSection from "./SettingSection";

const Profile = () => {
    const [admin, setAdmin] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '', // Add password field to formData
    });
    
    // Retrieve adminId dynamically from localStorage (replace with appropriate method if needed)
    const adminId = localStorage.getItem('id');
    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const response = await fetch(`https://billing-application-backend-production.up.railway.app/api/admin/getAdminDetails/${adminId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch admin profile');
                }
                const data = await response.json();
                setAdmin(data);
                setFormData({
                    name: data.name,
                    email: data.email,
                    password: data.password, // Password is left blank initially
                });
            } catch (error) {
                console.error('Error fetching admin profile:', error);
            }
        };

        fetchAdminProfile();
    }, [adminId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://billing-application-backend-production.up.railway.app/api/admin/updateAdmin/${adminId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),  // Make sure formData is valid JSON
            });
            if (!response.ok) {
                throw new Error('Failed to update admin profile');
            }
            const updatedAdmin = await response.json();
            setAdmin(updatedAdmin);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating admin profile:', error);
        }
    };
    

    if (!admin) {
        return <p>Loading...</p>;
    }

    return (
        <SettingSection icon={User} title={"Profile"}>
            {isEditing ? (
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 p-2 bg-gray-800 text-white rounded-md w-full"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 p-2 bg-gray-800 text-white rounded-md w-full"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="mt-1 p-2 bg-gray-800 text-white rounded-md w-full"
                            placeholder="Enter new password"
                        />
                        <small className="text-gray-400">Leave blank if you don't want to change the password.</small>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            ) : (
                <div>
                    <div className='flex flex-col sm:flex-row items-center mb-6'>
                        <img
                            src='https://t4.ftcdn.net/jpg/04/75/00/99/360_F_475009987_zwsk4c77x3cTpcI3W1C1LU4pOSyPKaqi.jpg'
                            alt='Profile'
                            className='rounded-full w-20 h-20 object-cover mr-4'
                        />
                        <div>
                            <h3 className='text-lg font-semibold text-gray-100'>{admin.name}</h3>
                            <p className='text-gray-400'>{admin.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditing(true)}
                        className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto'
                    >
                        Edit Profile
                    </button>
                </div>
            )}
        </SettingSection>
    );
};

export default Profile;
