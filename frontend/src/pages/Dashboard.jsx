// Dashboard Page Component
import React from 'react';
import { useAuthStore } from '../stores/authStore.js';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import FarmerDashboard from '../components/dashboards/FarmerDashboard';

const Dashboard = () => {
  const { user } = useAuthStore();

  // Route to appropriate dashboard based on role
  const renderDashboard = () => {
    switch (user?.role) {
      case 'ADMIN':
        return <AdminDashboard />;
      case 'FARMER':
        return <FarmerDashboard />;
      default:
        return <FarmerDashboard />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;