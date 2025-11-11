import React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const Stepper = ({ steps, currentStep, className }) => {
  return (
    <nav aria-label="Progress" className={className}>
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={cn(
              stepIdx !== steps.length - 1 ? 'flex-1' : '',
              'relative'
            )}
          >
            {step.status === 'complete' ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  {stepIdx !== steps.length - 1 && (
                    <div className="h-0.5 w-full bg-green-600" />
                  )}
                </div>
                <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-green-600 hover:bg-green-700">
                  <Check className="h-5 w-5 text-white" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            ) : step.status === 'current' ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  {stepIdx !== steps.length - 1 && (
                    <div className="h-0.5 w-full bg-gray-200" />
                  )}
                </div>
                <div
                  className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-green-600 bg-white"
                  aria-current="step"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-green-600"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            ) : (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  {stepIdx !== steps.length - 1 && (
                    <div className="h-0.5 w-full bg-gray-200" />
                  )}
                </div>
                <div className="group relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400">
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            )}
            <p className="mt-2 text-xs font-medium text-center">{step.name}</p>
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Vertical Stepper
const VerticalStepper = ({ steps, currentStep, className }) => {
  return (
    <nav aria-label="Progress" className={className}>
      <ol role="list" className="space-y-4">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {step.status === 'complete' ? (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                ) : step.status === 'current' ? (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-green-600 bg-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
                  </div>
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                  </div>
                )}
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className={cn(
                  "text-sm font-medium",
                  step.status === 'current' ? 'text-green-600' : 'text-gray-500'
                )}>
                  {step.name}
                </p>
                {step.description && (
                  <p className="text-sm text-gray-500">{step.description}</p>
                )}
              </div>
            </div>
            {stepIdx !== steps.length - 1 && (
              <div
                className="absolute left-5 top-11 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export { Stepper, VerticalStepper }
