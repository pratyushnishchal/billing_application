import React from "react";
import { motion } from "framer-motion"; // Optional for animation
import { FaRegClock, FaUsers, FaRegCheckCircle } from "react-icons/fa"; // Optional icons
import { NavLink as RouterNavLink } from "react-router-dom"; // Import NavLink from react-router-dom

const AboutPage = () => {
    // Fetch the backend URL from the environment variable
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <header className="bg-gray-800 text-white py-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-bold cursor-pointer transition-transform transform hover:scale-105 ml-6">
                        Invoicify
                    </h1>
                    <nav className="flex space-x-8">
                        <NavLink text="Home" to="/" />
                        <NavLink text="Features" to="/#features" />
                        <NavLink text="About" to="/about" />
                        <NavLink text="Contact" to="/contact" />
                        <NavLink text="Login" to="/#login" className="mr-4" />
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 text-white p-6">
                <motion.h1 
                    className="text-5xl font-bold mb-4 text-center" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ duration: 1 }}>
                    About Invoicify
                </motion.h1>

                <motion.p 
                    className="max-w-lg text-lg text-center mb-8" 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 1, delay: 0.5 }}>
                    Invoicify is your comprehensive solution for seamless invoice and billing management. Our platform is designed with a suite of powerful features that simplify your invoicing process, allowing you to dedicate more time to what truly matters—growing your business. Experience enhanced efficiency and accuracy as you effortlessly manage your invoices, track payments, and streamline your billing operations. With Invoicify, you can focus on driving success while we handle the complexities of invoicing for you.
                </motion.p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-white text-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center"
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            {feature.icon}
                            <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
                            <p className="text-center mt-2">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

// Custom NavLink component with updated 'to' attribute
const NavLink = ({ text, to, className }) => (
    <RouterNavLink
        to={to} // Updated to use 'to'
        className={`text-lg hover:bg-gray-700 hover:text-white transition duration-300 py-2 px-4 rounded-md ${className}`}
    >
        {text}
    </RouterNavLink>
);

// Features data with icons
const features = [
    {
        title: "Time-Saving",
        description: "Automate your billing and invoicing processes to save time.",
        icon: <FaRegClock className="text-green-500 text-3xl" />
    },
    {
        title: "User-Friendly",
        description: "Designed with the user in mind for an intuitive experience.",
        icon: <FaUsers className="text-blue-500 text-3xl" />
    },
    {
        title: "Reliable",
        description: "Ensure accuracy and reliability in your financial records.",
        icon: <FaRegCheckCircle className="text-yellow-500 text-3xl" />
    },
];

export default AboutPage;
