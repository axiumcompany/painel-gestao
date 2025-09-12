import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: LucideIcon;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full px-3 sm:px-5 py-3 sm:py-4 bg-gray-800/50 border border-white/10 rounded-lg sm:rounded-xl text-white text-sm sm:text-base
            placeholder-gray-400 focus:border-white/30 focus:outline-none focus:ring-2 
            focus:ring-white/10 transition-all duration-300
            ${Icon ? 'pl-10 sm:pl-12' : ''}
            ${error ? 'border-red-500/50 focus:border-red-500/70' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
      </div>
      {error && (
        <p className="text-red-400 text-xs sm:text-sm mt-1">{error}</p>
      )}
    </div>
  );
};