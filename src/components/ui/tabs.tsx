'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('Tabs components must be used within <Tabs>');
  return context;
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  onValueChange?: (value: string) => void;
}

function Tabs({ defaultValue, onValueChange, children, className, ...props }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  const handleChange = React.useCallback(
    (tab: string) => {
      setActiveTab(tab);
      onValueChange?.(tab);
    },
    [onValueChange]
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleChange }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

function TabsTrigger({ className, value, children, ...props }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive && 'bg-background text-foreground shadow-sm',
        className
      )}
      onClick={() => setActiveTab(value)}
      role="tab"
      aria-selected={isActive}
      {...props}
    >
      {children}
    </button>
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

function TabsContent({ className, value, children, ...props }: TabsContentProps) {
  const { activeTab } = useTabs();

  if (activeTab !== value) return null;

  return (
    <div
      className={cn('mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', className)}
      role="tabpanel"
      {...props}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };