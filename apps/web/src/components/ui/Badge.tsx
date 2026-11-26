import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'forest' | 'gold' | 'neutral' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const variantStyles = {
    forest: 'bg-forest-100 text-forest-800 border border-forest-300 font-semibold',
    gold: 'bg-gold-50 text-gold-800 border border-gold-300 font-semibold',
    neutral: 'bg-warm-100 text-neutral-800 border border-warm-300',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-medium',
    warning: 'bg-amber-50 text-amber-800 border border-amber-300 font-medium',
    danger: 'bg-rose-50 text-rose-800 border border-rose-300 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
