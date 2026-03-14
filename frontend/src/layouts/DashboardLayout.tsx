import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Users, Activity } from 'lucide-react';

/**
 * DashboardLayout
 * Includes a sidebar navigation and a top header for the Doctor's interface.
 * Scales fluidly on desktops and collapses smoothly on mobile devices.
 */
export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 selection:bg-teal-200">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm hidden md:flex">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-teal-700 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6" /> Maternal Health
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/doctor-dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-xl transition-all font-medium">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-xl transition-all font-medium">
            <Users className="w-5 h-5" /> All Patients
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white px-8 py-5 border-b border-gray-200 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-800">Doctor Portal</h2>
          <div className="h-10 w-10 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold border-2 border-teal-200">
            DR
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
