'use client';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon = '🔍', title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center animate-fade-in',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <span className="text-5xl mb-4" aria-hidden="true">
        {icon}
      </span>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-4">{description}</p>
      {action}
    </div>
  );
}