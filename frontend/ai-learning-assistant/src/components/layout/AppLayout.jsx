import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Brain, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../Logo';

const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'My Documents', icon: FileText, path: '/documents' },
    { label: 'Flashcards', icon: Brain, path: '/flashcards' },
    { label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static w-56 sm:w-64 bg-white shadow-md flex flex-col z-40 h-screen transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-3 sm:p-4 pl-4 sm:pl-5 border-b flex items-center">
          <Logo size={44} showText={true} />
        </div>
        <nav className="flex-1 p-3 sm:p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all text-sm sm:text-base"
            >
              <item.icon size={18} className="sm:size-5" />
              <span className="font-medium hidden sm:inline">{item.label}</span>
              <span className="font-medium sm:hidden text-xs">{item.label.split(' ')[0]}</span>
            </Link>
          ))}
        </nav>
        <div className="p-3 sm:p-4 border-t">
          <button 
            onClick={() => {
              logout();
              setSidebarOpen(false);
              navigate('/login');
            }}
            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 w-full text-red-500 hover:bg-red-50 rounded-lg transition-all text-sm sm:text-base"
          >
            <LogOut size={18} className="sm:size-5" />
            <span className="font-medium hidden sm:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;