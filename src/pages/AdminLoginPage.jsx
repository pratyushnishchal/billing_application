import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://billing-application-backend-production.up.railway.app/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            if (response.ok) {
                const data = await response.json();
                window.localStorage.setItem("userType", data.role); 
                window.localStorage.setItem("loggedIn", "true");
                localStorage.setItem("id", data.id);
                navigate('/dashboard');  // Redirect to the dashboard
            } else {
                alert("Invalid credentials");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            alert("Login failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 to-blue-400">
            <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl duration-300 ease-in-out">
                <h2 className="mb-6 text-3xl font-extrabold text-center text-white">Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-semibold text-gray-200" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="w-full p-3 bg-gray-800 text-gray-200 placeholder-gray-400 rounded-lg border border-gray-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-semibold text-gray-200" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="w-full p-3 bg-gray-800 text-gray-200 placeholder-gray-400 rounded-lg border border-gray-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full py-2 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-400 hover:to-purple-400 transition duration-300 shadow-md transform hover:scale-105"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-400">
                    &copy; {new Date().getFullYear()} Your Company. All rights reserved.
                </p>
            </div>
        </div>
    );
}

export default AdminLoginPage;
