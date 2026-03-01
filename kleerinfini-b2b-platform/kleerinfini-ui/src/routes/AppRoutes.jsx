import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Registration from '../pages/Registration2';
import AboutPage from '../client-dashboard/pages/AboutPage';
import HomePage from '../client-dashboard/pages/HomePage';
import DashboardLayout from '../client-dashboard/pages/DashboardLayout';
import MyProfile from '../client-dashboard/components/ProfileForm';
import ProgrammesExport from '../client-dashboard/pages/Valorisation';
import Homepage from '../pages/Homepage';
import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails'
import ProducerProfile2 from '../pages/ProducerProfile2';
import ProducerRegister2 from '../pages/ProducerRegister2';
import ExportFacilitation from '../pages/ExportFacilitation';
import DjazagroPage from '../pages/DjazagroPage';
import ProducerDashboard from '../pages/ProducerDashboard';
import Login from '../pages/Login';
import Producers from '../pages/Producers';
import ProtectedRoute from '../components/ProtectedRoute';
import Categories from '../pages/Categories'; // New import

// New Client Dashboard Pages
import DashboardHome from '../client-dashboard/pages/DashboardHome';
import ClientProducerSearch from '../client-dashboard/pages/ClientProducerSearch';
import ClientRequests from '../client-dashboard/pages/ClientRequests';
import ClientMessaging from '../client-dashboard/pages/ClientMessaging';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import ClientDocuments from '../client-dashboard/pages/ClientDocuments';
import ClientProfile from '../client-dashboard/pages/ClientProfile';
import ExportHubDashboard from '../export-hub/ExportHubDashboard';

// Admin Dashboard Pages
import AdminLayout from '../admin-dashboard/pages/AdminLayout';
import AdminStatistics from '../admin-dashboard/pages/AdminStatistics';
import AdminClients from '../admin-dashboard/pages/AdminClients';
import AdminProducers from '../admin-dashboard/pages/AdminProducers';
import AdminInvitations from '../admin-dashboard/pages/AdminInvitations';
import AdminPaymentSettings from '../admin-dashboard/pages/AdminPaymentSettings';
import AdminMessages from '../admin-dashboard/pages/AdminMessages';
import AdminReports from '../admin-dashboard/pages/AdminReports';

import ProducerLogin from '../pages/ProducerLogin';
import RegistrationPending from '../pages/RegistrationPending';
import LegalPage from '../pages/LegalPage';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        {/* French & Singular/Plural Aliases */}
        <Route path="/produits" element={<Navigate to="/products" replace />} />
        <Route path="/produit" element={<Navigate to="/products" replace />} />
        <Route path="/produits/:id" element={<Navigate to="/products/:id" replace />} />
        <Route path="/produit/:id" element={<Navigate to="/products/:id" replace />} />

        {/* Auth & Registration */}
        <Route path="/login" element={<Login />} />
        <Route path="/producer-login" element={<ProducerLogin />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/producer-inscription" element={<ProducerRegister2 />} />
        <Route path="/registration-pending" element={<RegistrationPending />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Public Pages */}
        <Route path="/producers" element={<Producers />} />
        <Route path="/producer/me" element={<ProtectedRoute><ProducerProfile2 /></ProtectedRoute>} />
        <Route path="/producer/:id" element={<ProducerProfile2 />} />
        <Route path="/producer2/:id" element={<Navigate to="/producer/:id" replace />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/valorisation" element={<ProgrammesExport />} />
        <Route path="/facilitation-export" element={<ExportFacilitation />} />
        <Route path="/djazagro" element={<DjazagroPage />} />

        {/* Legal Pages */}
        <Route path="/privacy" element={<LegalPage />} />
        <Route path="/terms" element={<LegalPage />} />
        <Route path="/cookies" element={<LegalPage />} />
        <Route path="/mentions" element={<LegalPage />} />
        <Route path="/legal/:type" element={<LegalPage />} />

        {/* Dashboards */}
        <Route path="/producer-dashboard/*" element={
          <ProtectedRoute allowedRoles={['producer', 'admin']}>
            <ProducerDashboard />
          </ProtectedRoute>
        } />

        {/* New Client Dashboard Routes with Protection */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['client', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="search" element={<ClientProducerSearch />} />
          <Route path="requests" element={<ClientRequests />} />
          <Route path="messages" element={<ClientMessaging />} />
          <Route path="documents" element={<ClientDocuments />} />
          <Route path="profile" element={<ClientProfile />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminStatistics />} />
          <Route path="statistics" element={<AdminStatistics />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="producers" element={<AdminProducers />} />
          <Route path="invitations" element={<AdminInvitations />} />
          <Route path="payment-settings" element={<AdminPaymentSettings />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/* Legacy redirects */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:id" element={<Categories />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;
