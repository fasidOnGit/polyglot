import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

interface RadioGroupItemProps extends React.ComponentProps<typeof RadioGroupPrimitive.Item> {
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
  label?: React.ReactNode
  cardClassName?: string
  contentClassName?: string
}

function RadioGroupItem({
  className,
  cardClassName,
  contentClassName,
  prefixIcon,
  suffixIcon,
  label,
  id,
  ...props
}: RadioGroupItemProps) {
  // Generate a unique ID if none provided
  const uniqueId = React.useId()
  const radioId = id || uniqueId

  return (
    <label
      htmlFor={radioId}
      className={cn(
        "flex items-center gap-3 rounded-md cursor-pointer transition-colors",
        cardClassName
      )}
    >
      <RadioGroupPrimitive.Item
        id={radioId}
        data-slot="radio-group-item"
        className={cn(
          "h-5 w-5 rounded-full border-2 border-[#0066CC] text-[#0066CC]",
          "focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        aria-labelledby={`${radioId}-label`}
        {...props}
      >
        <RadioGroupPrimitive.Indicator
          data-slot="radio-group-indicator"
          className="relative flex items-center justify-center after:block after:h-3 after:w-3 after:rounded-full after:bg-[#0066CC]"
        />
      </RadioGroupPrimitive.Item>

      <div 
        className={cn(
          "flex items-center flex-1",
          contentClassName
        )}
      >
        <div className="flex items-center gap-2">
          {prefixIcon && (
            <span className="flex items-center justify-center" aria-hidden="true">
              {prefixIcon}
            </span>
          )}
          
          {label && (
            <span id={`${radioId}-label`} className="text-2xl font-medium">
              {label}
            </span>
          )}
        </div>

        {suffixIcon && (
          <span className="flex items-center justify-center ml-auto" aria-hidden="true">
            {suffixIcon}
          </span>
        )}
      </div>
    </label>
  )
}

export { RadioGroup, RadioGroupItem }
