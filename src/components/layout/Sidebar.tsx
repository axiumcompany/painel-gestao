import React from 'react';
import { BarChart3, Users, Settings, FileText, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  isMobileOpen = false, 
  onMobileToggle 
}) => {
  const { isAdmin } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      visible: true
    },
    {
      id: 'users',
      label: 'Usuários',
      icon: Users,
      visible: isAdmin
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: FileText,
      visible: isAdmin
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: Settings,
      visible: true
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onMobileToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900/80 backdrop-filter backdrop-blur-2xl rounded-lg border border-white/10"
      >
        {isMobileOpen ? (
          <X className="text-white" size={20} />
        ) : (
          <Menu className="text-white" size={20} />
        )}
      </button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onMobileToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 
        bg-gray-900/90 lg:bg-gray-900/80 backdrop-filter backdrop-blur-2xl 
        border-r border-white/10 min-h-screen
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <nav className="p-4 lg:p-6 pt-16 lg:pt-6">
        <ul className="space-y-2">
          {menuItems.filter(item => item.visible).map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`
                  w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-300
                  ${activeTab === item.id
                    ? 'bg-gradient-to-r from-white to-gray-200 text-black font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <item.icon 
                  size={20} 
                  className={`mr-3 ${activeTab === item.id ? 'text-black' : ''}`} 
                />
                <span className="uppercase tracking-wider text-sm">
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
    </>
  );
};