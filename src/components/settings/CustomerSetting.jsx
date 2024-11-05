import { useEffect, useState } from 'react';
import { User } from "lucide-react";
import SettingSection from "./SettingSection";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CustomerSetting = () => {
    const [customer, setCustomer] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        mobileNumber: '',
    });
    const [walletAmount, setWalletAmount] = useState('');
    const [showWalletInput, setShowWalletInput] = useState(false); // State to control wallet input visibility

    const customerId = localStorage.getItem('id');
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const fetchCustomerProfile = async () => {
            try {
                const response = await fetch(`http://localhost:8094/api/users/customerinfo/${customerId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch customer profile');
                }
                const data = await response.json();
                setCustomer(data);
                setFormData({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    mobileNumber: data.mobileNumber
                });
            } catch (error) {
                console.error('Error fetching Customer profile:', error);
            }
        };

        fetchCustomerProfile();
    }, [customerId]);

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
            const response = await fetch(`http://localhost:8094/api/users/updateCustomer/${customerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Failed to update customer profile');
            }
            const updatedCustomer = await response.json();
            setCustomer(updatedCustomer);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating Customer profile:', error);
        }
    };

    const handleWalletChange = (e) => {
        setWalletAmount(e.target.value);
    };

    const handleAddToWallet = async (e) => {
        e.preventDefault();
        if (!walletAmount || walletAmount <= 0) {
            alert("Please enter a valid amount to add to wallet.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:8094/${customerId}/add-to-wallet?amount=${walletAmount}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(`Failed to add to wallet: ${responseData.message || 'Unknown error'}`);
            }

            // Update the customer state with the new wallet balance
            setCustomer((prevCustomer) => ({
                ...prevCustomer,
                walletBalance: responseData.walletBalance, // Ensure your API returns this value
            }));

            // Reset form state
            setWalletAmount('');
            setShowWalletInput(false); // Hide the wallet input after submission

            // Optional: Alert the user that the addition was successful
            alert('Amount added to wallet successfully!');

            // Navigate to the dashboard
        } catch (error) {
            console.error('Error adding to wallet:', error);
            navigate('/dashboard'); // Change this to your dashboard route
        }
    };

    if (!customer) {
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
                            src='https://t4.ftcdn.net/jpg/04/75/00/99/360_F_475009987_zwsk4c77x3cTpcI3W1C1LU4pOSyPKaqi.jpg'
                            alt='Profile'
                            className='rounded-full w-20 h-20 object-cover mr-4'
                        />
                        <div>
                            <h3 className='text-lg font-semibold text-gray-100'>{customer.name}</h3>
                            <p className='text-gray-400'>{customer.email}</p>
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

            {/* Wallet Balance Section */}
            <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-300">Wallet Balance: ₹{customer.walletBalance.toFixed(2)}</h4>

                {/* Button to toggle wallet input */}
                <button
                    onClick={() => setShowWalletInput(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                    Add to Wallet
                </button>

                {/* Wallet input and submit button */}
                {showWalletInput && (
                    <form onSubmit={handleAddToWallet} className="flex space-x-2 mt-4">
                        <input
                            type="number"
                            name="walletAmount" // Added name attribute
                            value={walletAmount}
                            onChange={handleWalletChange}
                            className="p-2 bg-gray-800 text-white rounded-md"
                            placeholder="Enter amount"
                            required
                        />

                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Confirm
                        </button>
                    </form>
                )}
            </div>
        </SettingSection>
    );
};

export default CustomerSetting;
