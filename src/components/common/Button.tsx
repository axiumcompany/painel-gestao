import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  icon?: LucideIcon;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon: Icon,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold uppercase tracking-wider transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) focus:outline-none focus:ring-2 focus:ring-white/20';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-100 hover:to-gray-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/20',
    secondary: 'bg-gray-800/50 text-white border border-white/20 hover:bg-gray-700/50 hover:border-white/30',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:-translate-y-0.5'
  };

  const sizeClasses = {
    sm: 'px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg',
    md: 'px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl',
    lg: 'px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl sm:rounded-2xl'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed transform-none' : ''}
        ${className}
      `}
    >
      {Icon && <Icon className="mr-1 sm:mr-2" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 18} />}
      {children}
    </button>
  );
};