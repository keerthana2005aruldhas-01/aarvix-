import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'forest' | 'bordered' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border border-warm-200 rounded-xl shadow-subtle',
    forest: 'bg-forest-900 text-white border border-forest-700/60 rounded-xl shadow-card',
    bordered: 'bg-white border-2 border-warm-300 rounded-xl',
    elevated: 'bg-white border border-warm-200 rounded-xl shadow-elevated',
  };

  return (
    <div className={`${variantStyles[variant]} p-6 transition-all duration-200 ${className}`} {...props}>
      {children}
    </div>
  );
};
