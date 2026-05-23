import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarAdmin from '../components/SidebarAdmin';
import AdminTopBar from '../components/AdminTopBar';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-[#F8FAFC] font-inter selection:bg-[#26B99A]/10 selection:text-[#26B99A]">
            {/* Sidebar fixe */}
            <SidebarAdmin />

            {/* Zone principale : prend tout l'espace à droite de la sidebar */}
            <div className="flex-1 flex flex-col min-w-0" style={{ marginLeft: '288px' }}>

                {/* Header fixe en haut */}
                <div className="sticky top-0 z-40">
                    <AdminTopBar />
                </div>

                {/* Contenu scrollable */}
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
