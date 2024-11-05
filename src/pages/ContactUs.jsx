import React, { useState } from "react";
import { motion } from "framer-motion";
import { NavLink as RouterNavLink } from "react-router-dom"; // Import NavLink from react-router-dom

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Submitted: ", formData);

        try {
            const response = await fetch("http://localhost:8094/contactus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData), // Send form data as JSON
            });

            if (response.ok) {
                setSubmitted(true);
                setFormData({
                    name: "",
                    email: "",
                    message: "",
                });
                // setTimeout(() => setSubmitted(false), 2000);
            } else {
                console.error("Failed to send message:", response.statusText);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Navbar */}
            <header className="bg-gray-800 text-white py-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-bold cursor-pointer transition-transform transform hover:scale-105 ml-6">
                        Invoicify
                    </h1>
                    <nav className="flex space-x-8">
                        <NavLink text="Home" href="/" />
                        <NavLink text="Features" href="/#features" />
                        <NavLink text="About" href="/about" />
                        <NavLink text="Contact" href="/contact" />
                        <NavLink text="Login" href="/#login" className="mr-6" />
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 text-white p-6">
                <motion.h2
                    className="text-4xl font-bold mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Contact Us
                </motion.h2>

                {submitted && (
                    <motion.p
                        className="bg-green-500 text-white py-2 px-4 rounded-lg mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        Message Sent!
                    </motion.p>
                )}

                <motion.form
                    onSubmit={handleSubmit}
                    className="bg-white text-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <label className="block text-sm font-semibold mb-2" htmlFor="name">
                            Name
                        </label>
                        <motion.input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </motion.div>

                    <motion.div
                        className="mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <label className="block text-sm font-semibold mb-2" htmlFor="email">
                            Email
                        </label>
                        <motion.input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </motion.div>

                    <motion.div
                        className="mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <label className="block text-sm font-semibold mb-2" htmlFor="message">
                            Message
                        </label>
                        <motion.textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            required
                        />
                    </motion.div>

                    <motion.button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Send Message
                    </motion.button>
                </motion.form>
            </main>
        </div>
    );
};

// Custom NavLink component
const NavLink = ({ text, href, className }) => (
    <RouterNavLink
        to={href}
        className={`text-lg hover:bg-gray-700 hover:text-white transition duration-300 py-2 px-4 rounded-md ${className}`}
    >
        {text}
    </RouterNavLink>
);

export default ContactUs;
