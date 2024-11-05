import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IndianRupee , Users, ShoppingBag, Eye } from "lucide-react";

// Assuming you're using Axios for API calls
import axios from 'axios';

const OverviewCards = () => {
  // State to store the fetched data
  const [overviewData, setOverviewData] = useState([
    { name: "Revenue", value: "$0", icon: IndianRupee  },
    { name: "Users", value: "0", icon: Users },
    { name: "Today's Orders", value: "0", icon: ShoppingBag },
    { name: "No of orders", value: "0", icon: Eye },
  ]);

  useEffect(() => {
    // Fetching data from the backend
    const fetchData = async () => {
      try {
        const [revenueRes, usersRes, ordersRes, pageViewsRes] = await Promise.all([
          axios.get('http://localhost:8094/analysis/totalSales'),
          axios.get('http://localhost:8094/analysis/countCustomer'),
          axios.get('http://localhost:8094/analysis/todaysOrder'),
          axios.get('http://localhost:8094/analysis/countInvoices')
        ]);

        // Set the fetched data into state
        setOverviewData([
          { name: "Revenue", value: `₹${revenueRes.data.toFixed(2)}`, icon: IndianRupee  },
          { name: "Users", value: usersRes.data, icon: Users },
          { name: "Today's Orders", value: ordersRes.data, icon: ShoppingBag },
          { name: "No of orders", value: pageViewsRes.data, icon: Eye }, // assuming daily orders are used for page views
        ]);
      } catch (error) {
        console.error("Error fetching overview data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
      {overviewData.map((item, index) => (
        <motion.div
          key={item.name}
          className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-sm font-medium text-gray-400'>{item.name}</h3>
              <p className='mt-1 text-xl font-semibold text-gray-100'>{item.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OverviewCards;
