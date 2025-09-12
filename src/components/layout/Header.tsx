import React from 'react';
import { LogOut, ArrowLeft, Settings, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';

export const Header: React.FC = () => {
  const { user, logout, viewingAs, returnToAdmin } = useAuth();

  return (
    <header className="bg-gray-900/80 backdrop-filter backdrop-blur-2xl border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-white to-gray-200 rounded-lg sm:rounded-xl">
                <Settings className="text-black" size={18} />
              </div>
              <h1 className="text-sm sm:text-xl font-bold text-white tracking-wider uppercase hidden sm:block">
                Financial Pro
              </h1>
              <h1 className="text-sm font-bold text-white tracking-wider uppercase sm:hidden">
                FP
              </h1>
            </div>
            
            {viewingAs && (
              <div className="hidden lg:flex items-center space-x-2">
                <Button
                  onClick={returnToAdmin}
                  variant="secondary"
                  size="sm"
                  icon={ArrowLeft}
                >
                  Voltar ao Admin
                </Button>
                <div className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs border border-blue-500/30">
                  Visualizando como: {viewingAs.name}
                </div>
              </div>
            )}
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="p-2 bg-gray-800/50 rounded-xl">
                <User className="text-gray-400" size={18} />
              </div>
              <div className="text-right">
                <p className="text-sm text-white font-medium">{user?.name}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  {user?.is_admin ? 'Admin' : 'User'}
                </p>
              </div>
            </div>
            
            <Button
              onClick={logout}
              variant="secondary"
              size="sm"
              icon={LogOut}
              className="sm:inline-flex"
            >
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
        
        {/* Mobile viewing as indicator */}
        {viewingAs && (
          <div className="lg:hidden mt-2 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs border border-blue-500/30 text-center">
            Visualizando como: {viewingAs.name}
            <button onClick={returnToAdmin} className="ml-2 underline">
              Voltar
            </button>
          </div>
        )}
      </div>
    </header>
  );
};