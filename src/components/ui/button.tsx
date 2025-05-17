
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border shadow-sm hover:shadow-md hover:-translate-y-0.5 active:shadow-sm active:translate-y-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary/80 text-primary-foreground backdrop-blur-md border-primary/20 hover:bg-primary/90",
        destructive:
          "bg-destructive/80 text-destructive-foreground backdrop-blur-md border-destructive/20 hover:bg-destructive/90",
        outline:
          "border border-input bg-transparent hover:bg-accent/20 hover:text-accent-foreground backdrop-blur-sm",
        secondary:
          "bg-secondary/80 text-secondary-foreground backdrop-blur-md border-secondary/20 hover:bg-secondary/80",
        ghost: "hover:bg-accent/20 hover:text-accent-foreground border-transparent",
        link: "text-primary underline-offset-4 hover:underline border-transparent",
        pixel: "bg-theme-accent/20 text-theme-blue border border-theme-accent/30 backdrop-blur-md hover:bg-theme-accent/30",
        green: "bg-theme-green/20 text-theme-green border border-theme-green/30 backdrop-blur-md hover:bg-theme-green/30",
        purple: "bg-theme-purple/20 text-theme-purple border border-theme-purple/30 backdrop-blur-md hover:bg-theme-purple/30",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-3xl px-4",
        lg: "h-11 rounded-full px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
