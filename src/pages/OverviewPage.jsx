import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
// import CustomerOrdersTable from "../components/orders/CustomerOrdersTable"
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
// import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import DailySalesTrend from "../components/sales/DailySalesTrend";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
// import SalesChannelChart from "../components/overview/SalesChannelChart";

const OverviewPage = () => {
    const userType = window.localStorage.getItem("userType");
    const [data, setData] = useState({
        totalSales: 0,
        totalCustomers: 0,
        totalProducts: 0,
        totalPendingAmount: 0,
    });

    const fetchData = async () => {
        try {
            const totalSalesResponse = await axios.get("https://billing-application-backend-production.up.railway.app/analysis/totalSales");
            const totalCustomersResponse = await axios.get("https://billing-application-backend-production.up.railway.app/analysis/countCustomer");
            const totalProductsResponse = await axios.get("https://billing-application-backend-production.up.railway.app/analysis/countProducts");
            const totalPendingAmountResponse = await axios.get("https://billing-application-backend-production.up.railway.app/analysis/pending-amount");

            setData({
                totalSales: totalSalesResponse.data,
                totalCustomers: totalCustomersResponse.data,
                totalProducts: totalProductsResponse.data,
                totalPendingAmount: totalPendingAmountResponse.data,
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='flex-1 overflow-auto'>
            <Header title='Overview' />
            <br />
        {userType === "ROLE_ADMIN" || userType ==="ROLE_ACCOUNTANT" ? (

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* STATS */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard name='Total Sales' icon={Zap} value={`₹${data.totalSales.toFixed(2)}`} color='#6366F1' />
                    <StatCard name='Total Customers' icon={Users} value={data.totalCustomers.toString()} color='#8B5CF6' />
                    <StatCard name='Total Products' icon={ShoppingBag} value={data.totalProducts.toString()} color='#EC4899' />
                    <StatCard name='Total Pending Amt.' icon={BarChart2} value={`₹${data.totalPendingAmount.toFixed(2)}` || 0} color='#10B981' />
                </motion.div>

                {/* CHARTS */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* <SalesOverviewChart /> */}
                    <DailySalesTrend />
                    <CategoryDistributionChart />
                    {/* <SalesChannelChart /> */}
                </div>
            </main>
            ):null}
            {userType === "ROLE_CUSTOMER"? (
                <CustomerOrdersTable />
                ):null}
        </div>
    );
};

export default OverviewPage;
