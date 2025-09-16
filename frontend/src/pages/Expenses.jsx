// Expenses Page Component
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Receipt } from 'lucide-react';

const Expenses = () => {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
        <p className="text-gray-600 mt-1">
          Track and manage dairy operation expenses.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Receipt className="mr-2 h-5 w-5" />
            Expense Management
          </CardTitle>
          <CardDescription>
            Record and categorize operational expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Expense management interface will be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Expenses;