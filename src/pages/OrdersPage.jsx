import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, Clock, IndianRupee , ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import DailyOrders from "../components/orders/DailyOrders";
import OrderDistribution from "../components/orders/OrderDistribution";
import OrdersTable from "../components/orders/OrdersTable";

const OrdersPage = () => {
	const [orderStats, setOrderStats] = useState({
		totalOrders: "0",
		todayOrders: "0",
		completedOrders: "0",
		totalRevenue: "$0",
	});

	const fetchOrderStats = async () => {
		try {
			const totalOrdersResponse = await axios.get("http://localhost:8094/analysis/countInvoices");
			const todayOrdersResponse = await axios.get("http://localhost:8094/analysis/todaysOrder");
			const completedOrdersResponse = await axios.get("http://localhost:8094/analysis/completedOrders");
			const totalRevenueResponse = await axios.get("http://localhost:8094/analysis/totalSales");

			setOrderStats({
				totalOrders: totalOrdersResponse.data.toString(),
				todayOrders: todayOrdersResponse.data.toString(),
				completedOrders: completedOrdersResponse.data.toString(),
				totalRevenue: `₹${totalRevenueResponse.data.toFixed(2)}`,
			});
		} catch (error) {
			console.error("Error fetching order statistics", error);
		}
	};

	useEffect(() => {
		fetchOrderStats();
	}, []);

	return (
		<div className='flex-1 relative z-10 overflow-auto'>
			<Header title={"Orders"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Orders' icon={ShoppingBag} value={orderStats.totalOrders} color='#6366F1' />
					<StatCard name="Today's Orders" icon={Clock} value={orderStats.todayOrders} color='#F59E0B' />
					<StatCard
						name='Completed Orders'
						icon={CheckCircle}
						value={orderStats.completedOrders}
						color='#10B981'
					/>
					<StatCard name='Total Revenue' icon={IndianRupee} value={orderStats.totalRevenue} color='#EF4444' />
				</motion.div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<DailyOrders />
					<OrderDistribution />
				</div>

				<OrdersTable />
			</main>
		</div>
	);
};
export default OrdersPage;
