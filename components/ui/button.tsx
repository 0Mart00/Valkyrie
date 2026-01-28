import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    
    // Minden, az interfészben felsorolt variánshoz hozzárendelünk egy stílust
    const variants = {
      default: "bg-emerald-600 text-white hover:bg-emerald-500 shadow",
      outline: "border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-200",
      ghost: "hover:bg-slate-800 text-slate-400 hover:text-emerald-400",
      secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700",
      destructive: "bg-red-900 text-white hover:bg-red-800",
      link: "text-emerald-500 underline-offset-4 hover:underline"
    }

    // A méretekhez tartozó osztályok
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-11 rounded-md px-8",
      icon: "h-9 w-9",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          // Típusbiztos indexelés kényszerítése
          variants[variant as keyof typeof variants],
          sizes[size as keyof typeof sizes],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }