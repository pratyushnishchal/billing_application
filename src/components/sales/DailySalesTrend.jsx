import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const DailySalesTrend = () => {
    const [dailySalesData, setDailySalesData] = useState([]);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await axios.get("http://localhost:8094/analysis/dailySales");
                setDailySalesData(response.data);
            } catch (error) {
                console.error("Error fetching daily sales data:", error);
            }
        };

        fetchSalesData();
    }, []);

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <h2 className='text-xl font-semibold text-gray-100 mb-4'>Daily Sales Trend</h2>

            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={dailySalesData}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                        <XAxis dataKey='date' stroke='#9CA3AF' />
                        <YAxis stroke='#9CA3AF' />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(31, 41, 55, 0.8)",
                                borderColor: "#4B5563",
                            }}
                            itemStyle={{ color: "#E5E7EB" }}
                        />
                        <Bar dataKey='sales' fill='#10B981' />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default DailySalesTrend;
