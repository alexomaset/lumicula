import React, { useState } from 'react';
import { cn } from '@/app/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    (<div className="relative w-full">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectTrigger) {
          return React.cloneElement(child as React.ReactElement<any>, {
            onClick: () => setIsOpen(!isOpen)
          });
        }
        return child;
      })}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 rounded-md bg-white shadow-lg">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === SelectContent) {
              return child;
            }
          })}
        </div>
      )}
    </div>)
  );
};

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onClick, ...props }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className={cn(
      'flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm',
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4" />
  </button>
));

SelectTrigger.displayName = 'SelectTrigger';

export const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => (
  <span ref={ref} className={cn('', className)} {...props}>
    {children}
  </span>
));

SelectValue.displayName = 'SelectValue';

export const SelectContent: React.FC<SelectContentProps> = ({ children }) => (
  <div className="py-1 border rounded-md bg-white shadow-xs">
    {children}
  </div>
);

SelectContent.displayName = 'SelectContent';

export const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => (
  <div 
    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
  >
    {children}
  </div>
);

SelectItem.displayName = 'SelectItem';
