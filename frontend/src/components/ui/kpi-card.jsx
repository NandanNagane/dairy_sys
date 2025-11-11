import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const KPICard = ({ 
  title, 
  value, 
  unit = '', 
  icon: Icon, 
  trend, 
  trendValue,
  variant = 'default',
  className,
  ...props 
}) => {
  const variantStyles = {
    default: 'border-l-4 border-l-primary',
    success: 'border-l-4 border-l-green-600',
    warning: 'border-l-4 border-l-amber-500',
    critical: 'border-l-4 border-l-red-600',
  }
  
  const iconStyles = {
    default: 'text-primary',
    success: 'text-green-600',
    warning: 'text-amber-500',
    critical: 'text-red-600',
  }

  const getTrendIcon = () => {
    if (!trend) return null
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  return (
    <Card className={cn(variantStyles[variant], className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className={cn("h-4 w-4", iconStyles[variant])} />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value} {unit && <span className="text-sm font-normal text-muted-foreground">{unit}</span>}
        </div>
        {(trend || trendValue) && (
          <div className="flex items-center pt-1 text-xs text-muted-foreground">
            {getTrendIcon()}
            {trendValue && <span className="ml-1">{trendValue}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { KPICard }
