import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { Users } from './components/users/Users';

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!user) {
    return <LoginForm />;
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false); // Close mobile sidebar when tab changes
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users />;
      case 'reports':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Relatórios</h2>
            <p className="text-gray-400">Funcionalidade em desenvolvimento</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Configurações</h2>
            <p className="text-gray-400">Funcionalidade em desenvolvimento</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Header />
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          isMobileOpen={isMobileSidebarOpen}
          onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full lg:w-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;