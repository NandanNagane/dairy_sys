// Reports Page Component
import React from 'react';
import { useAuthStore } from '../stores/authStore.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart3 } from 'lucide-react';

const Reports = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const isFarmer = user?.role === 'FARMER';

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {isAdmin ? 'Analytics & Reports' : 'My Reports'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isAdmin 
            ? 'Comprehensive analytics and reporting for the entire dairy operation.' 
            : 'Personal performance reports and milk collection analytics.'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            {isAdmin ? 'System Reports' : 'Personal Reports'}
          </CardTitle>
          <CardDescription>
            {isAdmin 
              ? 'Business intelligence, financial reports, and operational analytics' 
              : 'Track your performance, earnings, and collection trends'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            {isAdmin 
              ? 'Admin analytics and reporting interface will be implemented here' 
              : 'Farmer personal reports interface will be implemented here'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;