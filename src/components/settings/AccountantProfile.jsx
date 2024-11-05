import { useEffect, useState } from 'react';
import { User } from "lucide-react";
import SettingSection from "./SettingSection";

const AccountantProfile = () => {
    const [accountant, setAccountant] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        mobileNumber: '',
    });
    
    // Retrieve accountantId dynamically from localStorage
    const accountantId = localStorage.getItem('id'); // Fallback for demo purposes

    useEffect(() => {
        const fetchAccountantProfile = async () => {
            try {
                const response = await fetch(`https://billing-application-backend-production.up.railway.app/api/admin/accountantinfo/${accountantId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch accountant profile');
                }
                const data = await response.json();
                setAccountant(data);
                setFormData({
                    name: data.name,
                    email: data.email,
                    password: data.password, // Clear password field for privacy
                    mobileNumber: data.mobileNumber
                });
            } catch (error) {
                console.error('Error fetching accountant profile:', error);
            }
        };

        fetchAccountantProfile();
    }, [accountantId]);

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
            const response = await fetch(`https://billing-application-backend-production.up.railway.app/api/admin/updateAccountant/${accountantId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Failed to update accountant profile');
            }
            const updatedAccountant = await response.json();
            setAccountant(updatedAccountant);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating accountant profile:', error);
        }
    };

    if (!accountant) {
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
                            readOnly
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
                            readOnly
                        />
                    </div>
                    <div>
                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-300">Mobile Number</label>
                        <input
                            type="tel"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleInputChange}
                            className="mt-1 p-2 bg-gray-800 text-white rounded-md w-full"
                            required
                            readOnly
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
                            placeholder="Enter new password (leave blank to keep current)"
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
                            src='https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1730829058~exp=1730832658~hmac=42e64807dbcb16704b43fa5307132611fdf05f60c077311dfdc7d0043325d871&w=740'
                            alt='Profile'
                            className='rounded-full w-20 h-20 object-cover mr-4'
                        />
                        <div>
                            <h3 className='text-lg font-semibold text-gray-100'>{accountant.name}</h3>
                            <p className='text-gray-400'>{accountant.email}</p>
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

export default AccountantProfile;
