import { BarChart2, DollarSign, Menu, Settings, ShoppingBag, ShoppingCart, TrendingUp, Users, FileText, LogOut,Home,History   } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const SIDEBAR_ITEMS = [
	{
		name: "Overview",
		icon: BarChart2,
		color: "#6366f1",
		href: "/dashboard",
		roles: ["ROLE_ADMIN", "ROLE_ACCOUNTANT"],
	},
	{ name: "Home", icon: Home , color: "#8B5CF6", href: "/dashboard", roles: ["ROLE_CUSTOMER"] },
	{ name: "Products", icon: ShoppingBag, color: "#8B5CF6", href: "/products", roles: ["ROLE_ADMIN"] },
	{ name: "Users", icon: Users, color: "#EC4899", href: "/users", roles: ["ROLE_ACCOUNTANT", "ROLE_ADMIN"] },
	{ name: "Sales", icon: DollarSign, color: "#10B981", href: "/sales", roles: ["ROLE_ACCOUNTANT", "ROLE_ADMIN"] },
	{ name: "Orders", icon: ShoppingCart, color: "#F59E0B", href: "/orders", roles: ["ROLE_ACCOUNTANT", "ROLE_ADMIN"] },
	{ name: "Invoices", icon: FileText, color: "#6EE7B7", href: "/invoice", roles: ["ROLE_ACCOUNTANT", "ROLE_ADMIN"] },
	{ name: "Order History", icon: History , color: "yellow", href: "/order-history", roles: ["ROLE_CUSTOMER"] },
	{ name: "Analytics", icon: TrendingUp, color: "#3B82F6", href: "/analytics", roles: ["ROLE_ADMIN"] },
	{ name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings", roles: ["ROLE_ADMIN","ROLE_ACCOUNTANT","ROLE_CUSTOMER"] },

];

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const navigate = useNavigate();
	const userType = window.localStorage.getItem("userType");

	const handleLogout = () => {
		localStorage.removeItem("loggedIn");
		localStorage.removeItem("userType");
		localStorage.removeItem("id");
		navigate("/");
	};

	return (
		<motion.div
			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"}`}
			animate={{ width: isSidebarOpen ? 256 : 80 }}
		>
			<div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700'>
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
				>
					<Menu size={24} />
				</motion.button>

				<nav className='mt-8 flex-grow'>
					{SIDEBAR_ITEMS.filter(item => item.roles.includes(userType)).map((item) => (
						<Link key={item.href} to={item.href}>
							<motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
								<item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
								<AnimatePresence>
									{isSidebarOpen && (
										<motion.span
											className='ml-4 whitespace-nowrap'
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2, delay: 0.3 }}
										>
											{item.name}
										</motion.span>
									)}
								</AnimatePresence>
							</motion.div>
						</Link>
					))}
				</nav>

				{/* Logout Button */}
				<motion.button
					onClick={handleLogout}
					className='flex items-center p-4 text-sm font-medium rounded-lg mt-2 hover:bg-gray-700 transition-colors'
				>
					<LogOut size={20} style={{ color: "#F87171", minWidth: "20px" }} />
					<AnimatePresence>
						{isSidebarOpen && (
							<motion.span
								className='ml-4 whitespace-nowrap'
								initial={{ opacity: 0, width: 0 }}
								animate={{ opacity: 1, width: "auto" }}
								exit={{ opacity: 0, width: 0 }}
								transition={{ duration: 0.2, delay: 0.3 }}
							>
								Logout
							</motion.span>
						)}
					</AnimatePresence>
				</motion.button>
			</div>
		</motion.div>
	);
};

export default Sidebar;
