import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import OverviewPage from './pages/OverviewPage';
import ProductsPage from './pages/ProductsPage';
import UsersPage from './pages/UsersPage';
import SalesPage from './pages/SalesPage';
import OrdersPage from './pages/OrdersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import InvoicePage from './pages/InvoicePage';
import ProtectedRoute from './pages/ProtectedRoute';
import AdminLoginPage from './pages/AdminLoginPage';
import WelcomePage from './pages/WelcomePage';
import AboutPage from './pages/AboutPage';
import AccountantLoginPage from './pages/AccountantLoginPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import ProtectedLayout from './pages/ProtectedLayout';
import ContactUs from './pages/ContactUs';
import CustomerProfile from './pages/CustomerProfile';
import OrderHistoryPage from './pages/OrderHistoryPage';
import PaymentSuccess from './components/orders/PaymentSuccess';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState('');

    useEffect(() => {
        const loggedIn = window.localStorage.getItem("loggedIn") === "true";
        const type = window.localStorage.getItem("userType");
        setIsLoggedIn(loggedIn);
        setUserType(type);
    }, []);

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<WelcomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/admin-login" element={<AdminLoginPage setIsLoggedIn={setIsLoggedIn} setUserType={setUserType} />} />
            <Route path="/accountant-login" element={<AccountantLoginPage />} />
            <Route path="/customer-login" element={<CustomerLoginPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
                <Route element={<ProtectedLayout />}>
                    {userType === "ROLE_ADMIN" ? (
                        <>
                            <Route path="/dashboard" element={<OverviewPage />} />
                            <Route path="/products" element={<ProductsPage />} />
                            <Route path="/users" element={<UsersPage />} />
                            <Route path="/sales" element={<SalesPage />} />
                            <Route path="/orders" element={<OrdersPage />} />
                            <Route path="/analytics" element={<AnalyticsPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/invoice" element={<InvoicePage />} />
                        </>
                    ) : userType === "ROLE_ACCOUNTANT" ? (
                        <>
                            <Route path="/dashboard" element={<OverviewPage />} />
                            <Route path="/users" element={<UsersPage />} />
                            <Route path="/sales" element={<SalesPage />} />
                            <Route path="/orders" element={<OrdersPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/invoice" element={<InvoicePage />} />
                        </>
                    ) : (
                        <>
                            <Route path="/dashboard" element={<CustomerProfile />} />
                            <Route path="/order-history" element={<OrderHistoryPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/payment-success" element={<PaymentSuccess />} />

                        </>
                    )}
            
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
