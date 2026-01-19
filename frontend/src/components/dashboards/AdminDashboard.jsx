import React from "react";
import { KPICard } from "../ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import MilkCollectionForm from "../forms/MilkCollectionForm";
import AddFarmerDialog from "../forms/AddFarmerDialog";
import { toast } from "sonner";
import {
  Milk,
  DollarSign,
  AlertTriangle,
  Droplets,
  Package,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";

// Import TanStack Query hooks
import { 
  useDashboardStats, 
  useCreateMilkCollection 
} from '../../hooks/queries/useMilkCollections';
import { useCreateUser } from '../../hooks/queries/useUsers';

const AdminDashboard = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [addFarmerDialogOpen, setAddFarmerDialogOpen] = React.useState(false);

  // Fetch dashboard stats using TanStack Query
  const { 
    data: dashboardData, 
    isLoading, 
    isError,
    error 
  } = useDashboardStats();

  // Milk collection mutation
  const createMilkCollection = useCreateMilkCollection();

  // Create user mutation
  const createUser = useCreateUser();

  const handleMilkCollectionSubmit = async (data) => {
    try {
      console.log('📥 AdminDashboard received data:', data);
      
      // Create collection (optimistic update happens automatically)
      await createMilkCollection.mutateAsync(data);
      
      // Close dialog on success
      setDialogOpen(false);
    } catch (error) {
      // Error handling is done in the mutation
      console.error('Error in handleMilkCollectionSubmit:', error);
    }
  };

  const handleAddFarmer = async (formData) => {
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createUser.mutateAsync({
        ...formData,
        role: 'FARMER'
      });
      
      setAddFarmerDialogOpen(false);
    } catch (error) {
      // Error handling is done in the mutation
      console.error('Error in handleAddFarmer:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[100px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to load dashboard</h2>
          <p className="text-muted-foreground mb-4">
            {error?.message || 'Unable to fetch dashboard data'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your dairy management system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Milk Today"
          value={dashboardData.totalMilk}
          unit="L"
          icon={Milk}
          trend={dashboardData.percentageChange >= 0 ? "up" : "down"}
          trendValue={`${dashboardData.percentageChange >= 0 ? "+" : ""}${
            dashboardData.percentageChange
          }% from yesterday`}
          variant={dashboardData.percentageChange >= 0 ? "success" : "default"}
        />
        <KPICard
          title="Avg Fat Content"
          value={dashboardData.avgFat}
          unit="%"
          icon={Droplets}
          trend="stable"
          variant="default"
        />
        <KPICard
          title="Avg SNF"
          value={dashboardData.avgSNF}
          unit="%"
          icon={Droplets}
          trend="stable"
          variant="default"
        />
        <KPICard
          title="Payout Due"
          value={
            dashboardData.payoutDue >= 1000
              ? `₹${(dashboardData.payoutDue / 1000).toFixed(0)}k`
              : `₹${dashboardData.payoutDue}`
          }
          icon={DollarSign}
          variant="warning"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <KPICard
          title="Low Stock Items"
          value={dashboardData.lowStock}
          icon={Package}
          variant={dashboardData.lowStock > 0 ? "warning" : "success"}
        />
        <KPICard
          title="Active Alerts"
          value={dashboardData.alerts}
          icon={AlertTriangle}
          variant={dashboardData.alerts > 0 ? "critical" : "success"}
        />
        <KPICard
          title="Total Farmers"
          value={dashboardData.farmerCount}
          icon={Users}
          variant="default"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Record Collection Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="h-auto py-4 flex flex-col items-start"
                  variant="outline"
                >
                  <Milk className="h-6 w-6 mb-2" />
                  <span className="font-semibold">Record Collection</span>
                  <span className="text-xs text-muted-foreground">
                    Add new milk entry
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Record Milk Collection</DialogTitle>
                  <DialogDescription>
                    Add a new milk collection entry for a farmer.
                  </DialogDescription>
                </DialogHeader>
                <MilkCollectionForm onSubmit={handleMilkCollectionSubmit} />
              </DialogContent>
            </Dialog>

            <Button
              className="h-auto py-4 flex flex-col items-start"
              variant="outline"
            >
              <DollarSign className="h-6 w-6 mb-2" />
              <span className="font-semibold">Process Payout</span>
              <span className="text-xs text-muted-foreground">
                Generate payments
              </span>
            </Button>

            {/* Add Farmer Dialog */}
            <AddFarmerDialog
              trigger={
                <Button
                  className="h-auto py-4 flex flex-col items-start"
                  variant="outline"
                >
                  <Users className="h-6 w-6 mb-2" />
                  <span className="font-semibold">Add Farmer</span>
                  <span className="text-xs text-muted-foreground">
                    Register new farmer
                  </span>
                </Button>
              }
              open={addFarmerDialogOpen}
              onOpenChange={setAddFarmerDialogOpen}
              onSubmit={handleAddFarmer}
              isSubmitting={createUser.isPending}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <Milk className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Farmer #{100 + i}</p>
                      <p className="text-xs text-muted-foreground">
                        Morning shift
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">25.5 L</p>
                    <Badge variant="success" className="text-xs">
                      Verified
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>System Alerts</span>
              <Badge variant="critical">{dashboardData.alerts}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Low feed stock</p>
                  <p className="text-xs text-muted-foreground">
                    Protein mix below minimum level
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Device offline</p>
                  <p className="text-xs text-muted-foreground">
                    Temperature sensor #3 not responding
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Health check due</p>
                  <p className="text-xs text-muted-foreground">
                    5 cattle require vaccination
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
