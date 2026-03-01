import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarClient from '../components/SidebarClient';
import ClientHeader from '../components/ClientHeader';
import axios from '../../api/axios';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  React.useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await axios.get('client/stats/');
        setUnreadCount(res.data?.stats?.conversations || 0); // Temporary mapping or check real field
      } catch (err) {
        console.error("Failed to fetch unread count", err);
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-inter selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 transform md:translate-x-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:block h-full`}>
        <SidebarClient unreadCount={unreadCount} />
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 overflow-x-hidden relative">

        {/* Superior Header Layer */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md">
          <ClientHeader onMenuClick={() => setIsSidebarOpen(true)} />
        </div>

        <main className="flex-1 p-4 md:p-8 lg:p-14 overflow-y-auto">
          {/* Content Container with max width for readability and center alignment */}
          <div className="max-w-[1400px] mx-auto w-full h-full">
            <Outlet />
          </div>
        </main>

        {/* Dynamic Background Decorations */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[150px] -z-10 -translate-y-1/2 translate-x-1/2" />
        <div className="fixed bottom-0 left-[300px] w-[300px] h-[300px] bg-indigo-50/50 rounded-full blur-[120px] -z-10 translate-y-1/2" />
      </div>
    </div>
  );
};

export default DashboardLayout;