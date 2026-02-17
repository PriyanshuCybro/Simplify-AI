import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Brain, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../Logo';

const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'My Documents', icon: FileText, path: '/documents' },
    { label: 'Flashcards', icon: Brain, path: '/flashcards' },
    { label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 pl-5 border-b flex items-center">
          <Logo size={48} showText={true} />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-3 p-3 w-full text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;