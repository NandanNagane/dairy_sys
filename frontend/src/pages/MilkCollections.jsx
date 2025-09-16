// Milk Collections Page Component
import React from 'react';
import { useAuthStore } from '../stores/authStore.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Milk } from 'lucide-react';

const MilkCollections = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const isFarmer = user?.role === 'FARMER';

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {isAdmin ? 'Milk Collections Management' : 'My Milk Collections'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isAdmin 
            ? 'Record and manage daily milk collections from all farmers.' 
            : 'View your daily milk collection records and quality parameters.'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Milk className="mr-2 h-5 w-5" />
            {isAdmin ? 'All Collections' : 'My Collections'}
          </CardTitle>
          <CardDescription>
            {isAdmin 
              ? 'View and manage all milk collection records' 
              : 'View your milk collection history and quality metrics'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            {isAdmin 
              ? 'Admin milk collections interface will be implemented here' 
              : 'Farmer milk collections interface will be implemented here'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MilkCollections;