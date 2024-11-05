import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PaymentPopup = ({ isOpen, onClose, order }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Wallet');

    const navigate = useNavigate();

    if (!isOpen) return null;

    const handlePayment = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        const customerId = order?.customer?.id;
        const invoiceId = order?.id;

        const body = {
            customerId: customerId,
            invoiceId: invoiceId,
        };

        try {
            const response = await fetch(`http://localhost:8094/wallet?customerId=${customerId}&invoiceId=${invoiceId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json(); 
            if (!response.ok || data.message.includes("Insufficient wallet balance")) {
                throw new Error(data.message || 'Payment failed');
            }
            setSuccess(data.message);
            navigate('/payment-success'); 
            setTimeout(() => {
                navigate(-1); 
            }, 5000);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <motion.div
                className="bg-white rounded-lg shadow-lg p-6 w-96"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment for Invoice #{order?.id}</h2>

                <div className="mb-4">
                    <div className="text-gray-600">Customer: {order?.customer?.name}</div>
                    <div className="text-gray-600">Total Amount: ₹{order?.totalAmount}</div>
                    <div className="text-gray-600">Invoice Date: {order?.invoiceDate}</div>
                </div>

                {error && <div className="text-red-600 mb-4">{error}</div>}
                {success && <div className="text-green-600 mb-4">{success}</div>}

                <h3 className="text-lg font-semibold text-gray-800 mb-2">Select Payment Method</h3>
                <div className="grid grid-cols-1 gap-4 mb-4">
                    <button 
                        className={`flex items-center justify-between bg-gray-100 hover:bg-gray-200 rounded-lg p-3 transition duration-200 ${paymentMethod === 'Wallet' ? 'bg-gray-200' : ''}`}
                        onClick={() => { setPaymentMethod("Wallet"); }} 
                        disabled={loading}
                    >
                        <span className="font-medium text-gray-800">Pay By Wallet</span>
                        <span className="text-gray-600">💵</span>
                    </button>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 mr-2"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                        onClick={handlePayment}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Confirm Payment'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentPopup;
