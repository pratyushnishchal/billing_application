import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Trash } from "lucide-react";
import InvoiceModal from './InvoiceModal'; 

const OrdersTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState("All");
    const [selectedInvoice, setSelectedInvoice] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const userType = window.localStorage.getItem("userType");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("http://localhost:8094/api/accountant/getAllInvoice");
                if (!response.ok) {
                    throw new Error("Failed to fetch orders");
                }
                const data = await response.json();
                setOrders(data);
                setFilteredOrders(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        filterOrders(term, paymentStatus);
    };

    const handlePaymentStatusChange = (e) => {
        const status = e.target.value;
        setPaymentStatus(status);
        filterOrders(searchTerm, status);
    };

    const filterOrders = (term, status) => {
        let filtered = orders.filter(
            (order) =>
                order.id.toString().toLowerCase().includes(term) || 
                order.customer?.name?.toLowerCase().includes(term)
        );

        if (status === "Paid") {
            filtered = filtered.filter(order => order.paymentStatus === "Paid");
        } else if (status === "Unpaid") {
            filtered = filtered.filter(order => order.paymentStatus === "Unpaid");
        }

        setFilteredOrders(filtered);
    };

    const handleDelete = async (invoiceId) => {
        if (window.confirm("Are you sure you want to delete this invoice?")) {
            try {
                const response = await fetch(`http://localhost:8094/api/accountant/deleteInvoice/${invoiceId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error("Failed to delete invoice");
                }
                setOrders(orders.filter(order => order.id !== invoiceId));
                setFilteredOrders(filteredOrders.filter(order => order.id !== invoiceId));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const openModal = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedInvoice(null);
        setIsModalOpen(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
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
                <div className='flex items-center'>
                    <div className='relative mr-4'>
                        <input
                            type='text'
                            placeholder='Search orders...'
                            className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                    </div>
                    <select
                        value={paymentStatus}
                        onChange={handlePaymentStatusChange}
                        className='bg-gray-700 text-white rounded-lg p-2'
                    >
                        <option value="All">All</option>
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                    </select>
                </div>
            </div>

            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-700'>
                    <thead>
                        <tr>
                            <th className='px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider'>Invoice ID</th>
                            <th className='px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider'>Customer</th>
                            <th className='px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider'>Email</th>
                            <th className='px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider'>Total</th>
                            <th className='px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider'>Invoice Date</th>
                            <th className='px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider'>Payment Status</th>
                            <th className='px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider'>Payment Date</th>
                            <th className='px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider'>Actions</th>
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
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center'>{order.id}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center'>{order.customer?.name}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center'>{order.customer?.email}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center'>₹{order.totalAmount}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center'>{order.invoiceDate}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center'>{order.paymentStatus}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center'>{order.paymentStatus === "Unpaid" ? "-" : order.paymentDate}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center'>
                                    <button onClick={() => openModal(order)} className='text-indigo-400 hover:text-indigo-300 mr-2'>
                                        <Eye size={18} />
                                    </button>
                                    {userType === "ROLE_ADMIN" && (
                                        <button onClick={() => handleDelete(order.id)} className='text-red-400 hover:text-red-300'>
                                            <Trash size={18} />
                                        </button>
                                    )}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <InvoiceModal
                isOpen={isModalOpen}
                onClose={closeModal}
                invoice={selectedInvoice}
            />
        </motion.div>
    );
};

export default OrdersTable;
