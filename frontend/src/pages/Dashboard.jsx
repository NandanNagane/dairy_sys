// Dashboard Page Component
import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore.js';
import { useMilkCollectionStore } from '../stores/milkCollectionStore.js';
import { usePaymentStore } from '../stores/paymentStore.js';
import { useExpenseStore } from '../stores/expenseStore.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Milk, CreditCard, Receipt, TrendingUp, Users, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useAuthStore();
  const { stats: milkStats, fetchCollectionStats, fetchFarmerCollections } = useMilkCollectionStore();
  const { stats: paymentStats, fetchPaymentStats, fetchFarmerPayments } = usePaymentStore();
  const { stats: expenseStats, fetchExpenseStats } = useExpenseStore();

  useEffect(() => {
    // Fetch dashboard stats on component mount
    if (isAdmin()) {
      // Admin sees system-wide stats
      fetchCollectionStats();
      fetchPaymentStats();
      fetchExpenseStats();
    } else {
      // Farmer sees only their stats
      fetchFarmerCollections(user?.id);
      fetchFarmerPayments(user?.id);
    }
  }, [user, isAdmin, fetchCollectionStats, fetchPaymentStats, fetchExpenseStats, fetchFarmerCollections, fetchFarmerPayments]);

  const statsCards = [
    {
      title: 'Total Milk Collected',
      value: `${milkStats.totalQuantity || 0} L`,
      icon: Milk,
      description: 'Total milk collected this month',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Average Quality Score',
      value: `${(milkStats.averageQuality || 0).toFixed(1)}`,
      icon: TrendingUp,
      description: 'Average quality score',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Payments',
      value: `₹${(paymentStats.totalAmount || 0).toLocaleString()}`,
      icon: CreditCard,
      description: 'Total payments this month',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Expenses',
      value: `₹${(expenseStats.totalAmount || 0).toLocaleString()}`,
      icon: Receipt,
      description: 'Total expenses this month',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {isAdmin() ? 'Admin Dashboard' : 'Farmer Dashboard'}
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user?.firstName}! Here's what's happening with your 
          {isAdmin() ? ' dairy management system.' : ' farm operations.'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Today's Summary
            </CardTitle>
            <CardDescription>
              Quick overview of today's activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Milk Collections Today</span>
              <span className="font-semibold">0 L</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Payments Processed</span>
              <span className="font-semibold">₹0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expenses Recorded</span>
              <span className="font-semibold">₹0</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates in your dairy operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-gray-500 text-center py-8">
                No recent activity to display
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin-only section */}
      {isAdmin() && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              System Overview
            </CardTitle>
            <CardDescription>
              Administrative overview of the system
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Active Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">₹0</div>
              <div className="text-sm text-gray-600">Monthly Revenue</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;