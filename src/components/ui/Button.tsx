import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-base font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none shadow-soft',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-accent to-purple-600 text-white hover:from-purple-600 hover:to-accent shadow-lg hover:shadow-accent/40 focus:ring-accent/80 glass-btn',
        secondary:
          'bg-gradient-to-r from-purple-500 via-accent to-pink-500 text-white hover:from-accent hover:to-purple-600 shadow-lg hover:shadow-accent/40 focus:ring-accent/80 glass-btn',
        outline:
          'border-2 border-accent/40 bg-transparent text-accent hover:bg-accent/10 hover:text-white focus:ring-accent/60 glass-btn',
        ghost:
          'bg-transparent text-accent hover:bg-accent/10 focus:ring-accent/60',
        destructive:
          'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-pink-500 hover:to-red-500 shadow-lg',
      },
      size: {
        default: 'h-11 py-2 px-6',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-14 px-8 text-lg',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Glassmorphic utility for buttons (add this className in addition to variant)
// .glass-btn {
//   background: rgba(30, 32, 45, 0.6);
//   backdrop-filter: blur(12px);
//   border: 1.5px solid rgba(162, 89, 255, 0.18);
//   box-shadow: 0 2px 8px 0 rgba(162, 89, 255, 0.08);
// }


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 animate-spin">⟳</span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };