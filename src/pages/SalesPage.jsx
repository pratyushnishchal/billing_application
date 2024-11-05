import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios"; 
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { CreditCard, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import SalesByCategoryChart from "../components/sales/SalesByCategoryChart";
import DailySalesTrend from "../components/sales/DailySalesTrend";

const SalesPage = () => {
    const [salesStats, setSalesStats] = useState({
        totalRevenue: 0,
        averageOrderValue: 0,
        todaySales: 0,
        weeklySales: 0,
    });

    useEffect(() => {
        const fetchSalesStats = async () => {
            try {
                const totalRevenueResponse = await axios.get("http://localhost:8094/analysis/totalSales");
                const avgOrderValueResponse = await axios.get("http://localhost:8094/analysis/avgorderValue");
                const todaysSaleResponse = await axios.get("http://localhost:8094/analysis/todaysSale");
                const weekSalesResponse = await axios.get("http://localhost:8094/analysis/weekSales");

                setSalesStats({
                    totalRevenue: totalRevenueResponse.data,
                    averageOrderValue: avgOrderValueResponse.data,
                    todaySales: todaysSaleResponse.data,
                    weeklySales: weekSalesResponse.data,
                });
            } catch (error) {
                console.error("Error fetching sales statistics:", error);
            }
        };

        fetchSalesStats();
    }, []);

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Sales Dashboard' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* SALES STATS */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard 
                        name='Total Revenue' 
                        icon={DollarSign} 
                        value={`₹${salesStats.totalRevenue.toFixed(2)}`} 
                        color='#6366F1' 
                    />
                    <StatCard
                        name='Avg. Order Value'
                        icon={ShoppingCart}
                        value={`₹${salesStats.averageOrderValue.toFixed(2)}`}
                        color='#10B981'
                    />
                    <StatCard
                        name="Today's Sale"
                        icon={TrendingUp}
                        value={`₹${salesStats.todaySales.toFixed(2)}`}
                        color='#F59E0B'
                    />
                    <StatCard 
                        name='Weekly Sales' 
                        icon={CreditCard} 
                        value={`₹${salesStats.weeklySales.toFixed(2)}`} 
                        color='#EF4444' 
                    />
                </motion.div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
                    <SalesByCategoryChart />
                    <DailySalesTrend />
                </div>
            </main>
        </div>
    );
};

export default SalesPage;
