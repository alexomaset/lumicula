import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/app/lib/utils';

interface TabsContextType {
  selectedTab: string;
  setSelectedTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  // For controlled state
  value?: string;
  onValueChange?: (value: string) => void;
  // For uncontrolled state
  defaultValue?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ 
  value,
  onValueChange,
  defaultValue,
  children 
}) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '');
  
  // Determine if the component is controlled
  const isControlled = value !== undefined;
  const selectedTab = isControlled ? value : uncontrolledValue;
  
  const setSelectedTab = (newValue: string) => {
    if (isControlled) {
      onValueChange?.(newValue);
    } else {
      setUncontrolledValue(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab }}>
      <div>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div 
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface TabsTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ 
  value, 
  className, 
  children, 
  ...props 
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const { selectedTab, setSelectedTab } = context;

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        selectedTab === value 
          ? 'bg-background text-foreground shadow-sm' 
          : 'hover:bg-accent hover:text-accent-foreground',
        className
      )}
      onClick={() => setSelectedTab(value)}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<{ value: string; children: React.ReactNode }> = ({ 
  value, 
  children 
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  const { selectedTab } = context;

  return selectedTab === value ? <div>{children}</div> : null;
};