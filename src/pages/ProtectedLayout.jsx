// // src/pages/ProtectedLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar"; // Adjust the path as necessary

const ProtectedLayout = () => {
    return (
        <div className='flex h-screen bg-gray-900 text-gray-100'>
            <Sidebar />
            <div className="flex-grow p-4 overflow-auto"> {/* Allow overflow for scrolling */}
                <Outlet /> {/* This is where the protected content will be rendered */}
            </div>
        </div>
    );
};

export default ProtectedLayout;
