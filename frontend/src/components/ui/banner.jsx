import React from 'react'
import { AlertCircle, WifiOff, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

const Banner = ({ 
  variant = 'info', 
  message, 
  action,
  onAction,
  dismissible = false,
  onDismiss,
  icon,
  className 
}) => {
  const [dismissed, setDismissed] = React.useState(false)

  const variantStyles = {
    info: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-50',
    success: 'bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-50',
    warning: 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950 dark:text-amber-50',
    critical: 'bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-50',
    offline: 'bg-gray-800 text-white border-gray-700',
  }

  const defaultIcons = {
    info: AlertCircle,
    success: AlertCircle,
    warning: AlertCircle,
    critical: AlertCircle,
    offline: WifiOff,
  }

  const IconComponent = icon || defaultIcons[variant]

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  if (dismissed) return null

  return (
    <div
      className={cn(
        'flex items-center justify-between border-l-4 p-4 min-h-[56px]',
        variantStyles[variant],
        className
      )}
      role="alert"
    >
      <div className="flex items-center gap-3 flex-1">
        {IconComponent && <IconComponent className="h-5 w-5 flex-shrink-0" />}
        <p className="text-sm font-medium">{message}</p>
      </div>
      <div className="flex items-center gap-2">
        {action && onAction && (
          <Button
            onClick={onAction}
            variant="outline"
            size="sm"
            className="min-h-[36px]"
          >
            {action}
          </Button>
        )}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="ml-2 inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-black/10 dark:hover:bg-white/10"
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

// Offline Banner Component
const OfflineBanner = ({ onRetry }) => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine)

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <Banner
      variant="offline"
      message="You're offline. Some features may be limited."
      action={onRetry ? "Retry" : "Continue Offline"}
      onAction={onRetry}
      icon={WifiOff}
    />
  )
}

export { Banner, OfflineBanner }
