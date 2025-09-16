// Payments Page Component
import React from 'react';
import { useAuthStore } from '../stores/authStore.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { DollarSign } from 'lucide-react';

const Payments = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const isFarmer = user?.role === 'FARMER';

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {isAdmin ? 'Payment Management' : 'My Payments'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isAdmin 
            ? 'Process and manage farmer payments and billing.' 
            : 'View your payment history and outstanding balances.'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            {isAdmin ? 'All Payments' : 'My Payment History'}
          </CardTitle>
          <CardDescription>
            {isAdmin 
              ? 'Manage payments, billing cycles, and farmer compensations' 
              : 'Track your payments, dues, and transaction history'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            {isAdmin 
              ? 'Admin payment management interface will be implemented here' 
              : 'Farmer payment history interface will be implemented here'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;