import React from 'react';
import { motion } from 'framer-motion';

const InvoiceModal = ({ isOpen, onClose, invoice }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <motion.div
                className="bg-white rounded-lg p-6 shadow-lg max-w-lg w-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
            >
                <h2 className="text-lg font-semibold mb-4 text-black">Invoice Details</h2>
                {invoice ? (
                    <div>
                        <p className="text-black"><strong>Invoice ID:</strong> {invoice.id}</p>
                        <p className="text-black"><strong>Customer:</strong> {invoice.customer?.name}</p>
                        <p className="text-black"><strong>Email:</strong> {invoice.customer?.email}</p>
                        <p className="text-black"><strong>Total Amount:</strong> ₹{invoice.totalAmount}</p>
                        <p className="text-black"><strong>Invoice Date:</strong> {invoice.invoiceDate}</p>
                        <p className="text-black"><strong>Payment Status:</strong> {invoice.paymentStatus}</p>
                    </div>
                ) : (
                    <p className="text-black">No invoice selected.</p>
                )}
                <button 
                    onClick={onClose} 
                    className="mt-4 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition"
                >
                    Close
                </button>
            </motion.div>
        </div>
    );
};

export default InvoiceModal;
