// Milk Collections Page Component
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore.js';
import { useMilkCollections, useFarmerCollections } from '../hooks/queries/useMilkCollections';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { 
  Milk, 
  Calendar, 
  TrendingUp, 
  Droplets,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const MilkCollections = () => {
  const { user } = useAuthStore();
  
  const isAdmin = user?.role === 'ADMIN';
  const isFarmer = user?.role === 'FARMER';

  const [currentPage, setCurrentPage] = useState(1);

  const params = {
    page: currentPage,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  };

  // Use appropriate hook based on role
  const { data, isLoading, error, refetch } = isAdmin
    ? useMilkCollections(params)
    : useFarmerCollections(user?.id, params);


    
  // Extract data
  const collections = data?.collections || [];
  const summary = data?.summary || null;
  const pagination = data?.pagination || null;

  const handleRefresh = () => {
    refetch();
    toast.success('Data refreshed!');
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading && collections.length === 0) {
    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isAdmin ? 'Milk Collections Management' : 'My Milk Collections'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isAdmin 
                ? 'Record and manage daily milk collections from all farmers.' 
                : 'View your daily milk collection records and quality parameters.'}
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
              <Milk className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.totalQuantity?.toFixed(1) || 0} L
              </div>
              <p className="text-xs text-muted-foreground">
                {summary.totalRecords || 0} collections
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Fat</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.averageFat?.toFixed(2) || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Average fat content
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg SNF</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.averageSnf?.toFixed(2) || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Average SNF content
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.totalRecords || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Collection entries
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Collections Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Milk className="mr-2 h-5 w-5" />
                {isAdmin ? 'All Collections' : 'My Collections'}
              </CardTitle>
              <CardDescription>
                {isAdmin 
                  ? 'View and manage all milk collection records' 
                  : 'View your milk collection history and quality metrics'}
              </CardDescription>
            </div>
            {/* Future: Add filter button */}
          </div>
        </CardHeader>
        <CardContent>
          {collections.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Milk className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No collections found</p>
              <p className="text-sm">Start recording milk collections to see them here</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      {isAdmin && <TableHead>Farmer</TableHead>}
                      <TableHead className="text-right">Quantity (L)</TableHead>
                      <TableHead className="text-right">Fat (%)</TableHead>
                      <TableHead className="text-right">SNF (%)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collections.map((collection) => (
                      <TableRow key={collection.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {format(new Date(collection.createdAt), 'MMM dd, yyyy')}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(collection.createdAt), 'hh:mm a')}
                            </span>
                          </div>
                        </TableCell>
                        {isAdmin && (
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{collection.user?.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {collection.user?.email}
                              </span>
                            </div>
                          </TableCell>
                        )}
                        <TableCell className="text-right font-medium">
                          {collection.quantity.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {collection.fatPercentage.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {collection.snf.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={collection.isBilled ? "success" : "secondary"}>
                            {collection.isBilled ? 'Billed' : 'Pending'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {pagination.currentPage} of {pagination.totalPages}
                    {' • '}
                    {pagination.totalCount} total records
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrevPage || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNextPage || isLoading}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MilkCollections;