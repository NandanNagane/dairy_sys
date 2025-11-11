// Hook for using toast notifications with sonner
import { toast as sonnerToast } from 'sonner'

/**
 * Custom hook for toast notifications
 * Wrapper around sonner's toast for consistency with our design system
 * 
 * @example
 * const { toast } = useToast()
 * 
 * toast.success('Operation successful!')
 * toast.error('Something went wrong')
 * toast.warning('Please review this')
 * toast.info('FYI: Some information')
 */
export const useToast = () => {
  const toast = {
    success: (message, options = {}) => {
      return sonnerToast.success(message, {
        duration: 5000,
        ...options,
      })
    },
    error: (message, options = {}) => {
      return sonnerToast.error(message, {
        duration: 5000,
        ...options,
      })
    },
    warning: (message, options = {}) => {
      return sonnerToast.warning(message, {
        duration: 5000,
        ...options,
      })
    },
    info: (message, options = {}) => {
      return sonnerToast.info(message, {
        duration: 5000,
        ...options,
      })
    },
    loading: (message, options = {}) => {
      return sonnerToast.loading(message, options)
    },
    promise: sonnerToast.promise,
    dismiss: sonnerToast.dismiss,
  }

  return { toast }
}

// Export sonner's toast directly for advanced usage
export { toast } from 'sonner'
