import { motion } from "framer-motion";
import { FaUserShield, FaUserTie, FaUserCircle } from "react-icons/fa";
import MainImage from "/src/Main.jpg";
import { useState } from "react";

const WelcomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-800 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold cursor-pointer transition-transform transform hover:scale-105">
            Invoicify
          </h1>
          <nav className="hidden md:flex space-x-4 lg:space-x-8">
            <NavLink text="Home" href="/" />
            <NavLink text="Features" href="#features" />
            <NavLink text="About" href="/about" />
            <NavLink text="Contact" href="/contact" />
            <NavLink text="Login" href="#login" className="mr-2" />
          </nav>
          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-700 text-white">
            <div className="flex flex-col items-start px-4 py-2 space-y-2">
              <NavLink
                text="Features"
                href="#features"
                className="w-full"
                onClick={toggleMenu}
              />
              <NavLink
                text="About"
                href="/about"
                className="w-full"
                onClick={toggleMenu}
              />
              <NavLink
                text="Contact"
                href="/contact"
                className="w-full"
                onClick={toggleMenu}
              />
              <NavLink
                text="Login"
                href="#login"
                className="w-full"
                onClick={toggleMenu}
              />
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main
        className="flex-grow flex flex-col items-center justify-center bg-cover bg-center text-white h-[calc(100vh-64px)] px-4 sm:px-8" // Adjust height calculation as needed
        style={{ backgroundImage: `url(${MainImage})` }} // Set local image as background
      >
        <motion.div
          className="bg-black bg-opacity-50 p-6 sm:p-10 rounded-lg text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
          >
            Welcome to Invoicify
          </motion.h2>
          <motion.p
            className="mb-8 text-base sm:text-lg"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7, type: "spring" }}
          >
            Your ultimate solution for managing invoices and billing.
          </motion.p>
          <motion.a
            href="#login"
            className="bg-white text-blue-600 py-2 px-4 sm:px-6 rounded-lg hover:bg-gray-200 transition"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
          >
            Get Started
          </motion.a>
        </motion.div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-200 px-4 sm:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white shadow-md rounded-lg p-4 sm:p-6 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl" // Updated hover effects
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-32 sm:h-40 object-cover rounded-t-lg mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Cards Section */}
      <section
        id="login"
        className="py-16 bg-gray-100 text-center px-4 sm:px-8"
      >
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Login as</h2>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            {loginOptions.map((option, index) => (
              <motion.div
                key={index}
                className="bg-white shadow-lg rounded-lg p-4 sm:p-6 w-64 h-80 sm:h-96 flex flex-col justify-between" // Increased height
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="flex flex-col items-center mb-4">
                  <span
                    className={`text-5xl sm:text-6xl ${option.iconColor} mb-4`}
                  >
                    {option.icon}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-center text-sm sm:text-base">
                    {option.description}
                  </p>
                </div>
                <a href={option.link}>
                  <button
                    className={`${option.bgColor} text-white py-2 px-4 rounded-lg hover:opacity-90 transition w-full`}
                  >
                    {option.buttonText}
                  </button>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// NavLink component
const NavLink = ({ text, href, className, onClick }) => (
  <motion.a
    href={href}
    className={`text-lg hover:bg-gray-700 hover:text-white transition duration-300 py-2 px-4 rounded-md ${className}`}
    onClick={onClick}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
  >
    {text}
  </motion.a>
);

// Features data with images
const features = [
  {
    title: "Easy Invoice Generation",
    description: "Create and manage your invoices effortlessly.",
    image:
      "https://plus.unsplash.com/premium_photo-1679923814036-8febf10a04c0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Payment Tracking",
    description: "Keep track of all your payments and invoices.",
    image:
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Analytics Dashboard",
    description: "Gain insights into your sales and invoicing trends.",
    image:
      "https://plus.unsplash.com/premium_photo-1661384118133-8f8b6eef9715?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

// Login options data with images, icons, and colors
const loginOptions = [
  {
    title: "Admin Login",
    description: "Access all features as an administrator.",
    buttonText: "Admin Login",
    bgColor: "bg-blue-500",
    link: "/admin-login",
    icon: <FaUserShield className="text-4xl" />,
    iconColor: "text-blue-600",
  },
  {
    title: "Accountant Login",
    description: "Manage invoices and client accounts.",
    buttonText: "Accountant Login",
    bgColor: "bg-green-500",
    link: "/accountant-login",
    icon: <FaUserTie className="text-4xl text-green-600" />,
    iconColor: "text-green-600",
  },
  {
    title: "Customer Login",
    description: "View and manage your billing information.",
    buttonText: "Customer Login",
    bgColor: "bg-yellow-500",
    link: "/customer-login",
    icon: <FaUserCircle className="text-4xl text-yellow-600" />,
    iconColor: "text-yellow-600",
  },
];

export default WelcomePage;
