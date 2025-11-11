import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { FileX, PackageOpen, Search, Plus } from 'lucide-react'

const EmptyState = ({ 
  icon: Icon = PackageOpen,
  title,
  description,
  action,
  onAction,
  className 
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50',
        className
      )}
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          {description}
        </p>
      )}
      {action && onAction && (
        <Button onClick={onAction} className="mt-6" size="lg">
          <Plus className="mr-2 h-4 w-4" />
          {action}
        </Button>
      )}
    </div>
  )
}

// Preset empty states
const NoDataFound = ({ onReset, searchTerm }) => (
  <EmptyState
    icon={Search}
    title="No results found"
    description={searchTerm ? `No results for "${searchTerm}". Try adjusting your search.` : "No data available."}
    action={onReset ? "Clear filters" : null}
    onAction={onReset}
  />
)

const NoRecordsYet = ({ entityName = "records", onCreate }) => (
  <EmptyState
    icon={PackageOpen}
    title={`No ${entityName} yet`}
    description={`Get started by creating your first ${entityName.slice(0, -1)}.`}
    action={`Add ${entityName.slice(0, -1)}`}
    onAction={onCreate}
  />
)

const ErrorState = ({ onRetry }) => (
  <EmptyState
    icon={FileX}
    title="Something went wrong"
    description="We couldn't load the data. Please try again."
    action="Retry"
    onAction={onRetry}
  />
)

export { EmptyState, NoDataFound, NoRecordsYet, ErrorState }
