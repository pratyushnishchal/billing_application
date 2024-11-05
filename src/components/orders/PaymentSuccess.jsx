import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
    const navigate = useNavigate();

    const handleReturn = () => {
        navigate('/dashboard'); 
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-8 w-96 text-center">
                <h2 className="text-2xl font-semibold text-green-600 mb-4">Payment Successful!</h2>
                <p className="text-gray-700 mb-4">Thank you for your payment. Your transaction has been completed successfully.</p>
                <p className="text-gray-600 mb-4">You will receive a confirmation email shortly.</p>
                
                <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    onClick={handleReturn}
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;
