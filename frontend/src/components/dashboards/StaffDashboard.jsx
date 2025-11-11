import React from 'react'
import { KPICard } from '../ui/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  Milk, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const StaffDashboard = () => {
  const [shiftData, setShiftData] = React.useState({
    shiftType: 'Morning',
    totalCollections: 23,
    totalLiters: 450.5,
    pendingVerifications: 3,
    avgFat: 4.1,
    avgSNF: 8.4
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
          <p className="text-muted-foreground">
            {shiftData.shiftType} Shift - {new Date().toLocaleDateString()}
          </p>
        </div>
        <Badge variant="success" className="h-8 px-4 text-sm">
          <Clock className="mr-2 h-4 w-4" />
          Shift Active
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Collections Today"
          value={shiftData.totalCollections}
          icon={Milk}
          variant="success"
        />
        <KPICard
          title="Total Liters"
          value={shiftData.totalLiters}
          unit="L"
          icon={Milk}
          trend="up"
          variant="success"
        />
        <KPICard
          title="Pending Verifications"
          value={shiftData.pendingVerifications}
          icon={AlertCircle}
          variant={shiftData.pendingVerifications > 0 ? "warning" : "success"}
        />
        <KPICard
          title="Avg Fat/SNF"
          value={`${shiftData.avgFat}/${shiftData.avgSNF}`}
          unit="%"
          icon={TrendingUp}
          variant="default"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button size="lg" className="h-auto py-6 flex flex-col">
              <Milk className="h-8 w-8 mb-2" />
              <span className="font-semibold">Record Collection</span>
            </Button>
            <Button size="lg" variant="outline" className="h-auto py-6 flex flex-col">
              <CheckCircle className="h-8 w-8 mb-2" />
              <span className="font-semibold">Verify Entries</span>
            </Button>
            <Button size="lg" variant="outline" className="h-auto py-6 flex flex-col">
              <DollarSign className="h-8 w-8 mb-2" />
              <span className="font-semibold">View Rates</span>
            </Button>
            <Button size="lg" variant="outline" className="h-auto py-6 flex flex-col">
              <Calendar className="h-8 w-8 mb-2" />
              <span className="font-semibold">Shift Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Verifications */}
      {shiftData.pendingVerifications > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-900">
              <AlertCircle className="mr-2 h-5 w-5" />
              Pending Verifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-800">
              You have {shiftData.pendingVerifications} collections waiting for verification.
            </p>
            <Button className="mt-4" variant="default">
              Review Now
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default StaffDashboard
