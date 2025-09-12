import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm sm:max-w-md',
    md: 'max-w-lg sm:max-w-2xl',
    lg: 'max-w-2xl sm:max-w-4xl',
    xl: 'max-w-4xl sm:max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`
        relative w-full ${sizeClasses[size]} max-h-[95vh] sm:max-h-[90vh] overflow-y-auto
        bg-gray-900/90 backdrop-filter backdrop-blur-2xl rounded-2xl sm:rounded-3xl
        border border-white/10 shadow-2xl
        animate-in fade-in-0 zoom-in-95 duration-300
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
          <h2 className="text-lg sm:text-2xl font-bold text-white uppercase tracking-wider">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};