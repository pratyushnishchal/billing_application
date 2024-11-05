import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { RiHandCoinLine } from 'react-icons/ri';
import PaymentPopup from './PaymentPopup';

const CustomerOrdersTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const customerId = localStorage.getItem("id");

    useEffect(() => {
        const fetchOrders = async () => {
            if (!customerId) {
                setError("Customer ID is not available.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`https://billing-application-backend-production.up.railway.app/invoice/${customerId}`);
                const data = await response.json();

                if (data.message) {
                    setError(data.message); 
                    setOrders([]); 
                    setFilteredOrders([]);
                } else {
                    setOrders(data);
                    setFilteredOrders(data);
                }

                setLoading(false);
            } catch (err) {
                setError("Failed to fetch orders");
                setLoading(false);
            }
        };

        fetchOrders();
    }, [customerId]);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = orders.filter(
            (order) =>
                order.id.toString().toLowerCase().includes(term) || 
                order.customer?.name?.toLowerCase().includes(term)
        );
        setFilteredOrders(filtered);
    };

    const handlePayClick = (order) => {
        setSelectedOrder(order);
        setIsPopupOpen(true);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-semibold text-gray-100'>Order List</h2>
                <div className='relative'>
                    <input
                        type='text'
                        placeholder='Search orders...'
                        className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                </div>
            </div>

            {error ? (
                <div className="text-gray-400 text-center">{error}</div>
            ) : (
                <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-700'>
                        <thead>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Invoice ID
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Customer
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Email
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Total Amt
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Invoice Date
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Pay
                                </th>
                            </tr>
                        </thead>

                        <tbody className='divide divide-gray-700'>
                            {filteredOrders.map((order) => (
                                <motion.tr
                                    key={order.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                                        {order.id}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                                        {order.customer?.name}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                                        {order.customer?.email}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                                    ₹{order.totalAmount}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{order.invoiceDate}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                        <button 
                                            className='text-green-400 hover:text-green-300'
                                            onClick={() => handlePayClick(order)}
                                        >
                                            <RiHandCoinLine size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <PaymentPopup 
                isOpen={isPopupOpen} 
                onClose={() => setIsPopupOpen(false)} 
                order={selectedOrder} 
            />
        </motion.div>
    );
};

export default CustomerOrdersTable;
