import React from 'react'
import { KPICard } from '../ui/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { 
  Milk, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Droplets,
  Bell,
  MessageSquare
} from 'lucide-react'

const FarmerDashboard = () => {
  const [farmerData, setFarmerData] = React.useState({
    todayLiters: 28.5,
    avgFat: 4.3,
    avgSNF: 8.6,
    estimatedPayout: 2850,
    weeklyData: [25, 27, 26, 28, 29, 27, 28.5],
    smsEnabled: true,
    lastCollection: '6:30 AM'
  })

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your dairy summary
          </p>
        </div>
        <Badge variant={farmerData.smsEnabled ? "success" : "outline"}>
          <MessageSquare className="mr-1 h-3 w-3" />
          SMS: {farmerData.smsEnabled ? 'Enabled' : 'Disabled'}
        </Badge>
      </div>

      {/* Today's Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Today's Milk"
          value={farmerData.todayLiters}
          unit="L"
          icon={Milk}
          trend="up"
          trendValue="+2.5L from avg"
          variant="success"
        />
        <KPICard
          title="Fat Content"
          value={farmerData.avgFat}
          unit="%"
          icon={Droplets}
          variant="success"
        />
        <KPICard
          title="SNF Content"
          value={farmerData.avgSNF}
          unit="%"
          icon={Droplets}
          variant="success"
        />
        <KPICard
          title="Estimated Payout"
          value={`₹${farmerData.estimatedPayout}`}
          icon={DollarSign}
          variant="default"
        />
      </div>

      {/* 7-Day Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            7-Day Production Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {farmerData.weeklyData.map((liters, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{weekDays[index]}</span>
                  <span className="text-muted-foreground">{liters} L</span>
                </div>
                <Progress 
                  value={(liters / 30) * 100} 
                  variant="success"
                  className="h-2"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Weekly Average</span>
              <span className="text-lg font-bold text-green-600">
                {(farmerData.weeklyData.reduce((a, b) => a + b, 0) / 7).toFixed(1)} L
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Payment Summary
            </span>
            <Badge variant="outline">This Month</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Milk Supplied</span>
              <span className="text-lg font-semibold">785 L</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estimated Earnings</span>
              <span className="text-2xl font-bold text-green-600">₹78,500</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm text-muted-foreground">Last Payment</span>
              <Badge variant="success">
                ₹75,200 • 2 days ago
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Last Collection</p>
                <p className="text-xs text-blue-700">Today at {farmerData.lastCollection}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">Quality Bonus</p>
                <p className="text-xs text-green-700">High fat content - Extra ₹2/L this week</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FarmerDashboard
