import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarAdmin from '../components/SidebarAdmin';
import AdminTopBar from '../components/AdminTopBar';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-[#F8FAFC] font-inter selection:bg-[#26B99A]/10 selection:text-[#26B99A]">
            {/* Sidebar - Desktop Only for now */}
            <SidebarAdmin />

            {/* Main Content Area */}
            <div className="flex-1 ml-72 flex flex-col min-w-0 transition-all duration-300">

                {/* Sticky Header */}
                <div className="sticky top-0 z-40">
                    <AdminTopBar />
                </div>

                {/* Scrollable Main Content */}
                <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                    <div className="max-w-[1600px] mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
