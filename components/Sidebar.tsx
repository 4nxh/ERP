import React, { useState } from 'react';
import { Home, BookOpen, User, Settings, LogOut, Menu, Bell, PieChart } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  newNoticesCount?: number;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, newNoticesCount = 0, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'home', icon: <Home size={20} />, label: 'Dashboard' },
    { id: 'attendance', icon: <PieChart size={20} />, label: 'Attendance' },
    { id: 'academics', icon: <BookOpen size={20} />, label: 'Academics' },
    { id: 'notices', icon: <Bell size={20} />, label: 'Notices', badge: newNoticesCount },
    { id: 'profile', icon: <User size={20} />, label: 'Profile' },
  ];

  return (
    <div className={`hidden md:flex flex-col bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 h-screen sticky top-0 shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? 'w-20' : 'w-72'}`}>
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-neutral-400 transition-colors focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="px-4 mb-6 flex-1">
        {!isCollapsed && (
          <p className="text-xs font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider mb-2 px-2 whitespace-nowrap opacity-100 transition-opacity duration-200">Main Menu</p>
        )}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-start px-4'} py-3 rounded-xl transition-all duration-200 font-medium ${isActive
                  ? 'bg-blue-50 dark:bg-neutral-800 text-blue-600 dark:text-neutral-100 shadow-sm dark:shadow-none'
                  : 'text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800/50 hover:text-gray-900 dark:hover:text-neutral-200'
                  }`}
                title={isCollapsed ? item.label : ''}
              >
                {item.icon}
                {!isCollapsed && <span className="ml-3 whitespace-nowrap">{item.label}</span>}

                {/* Badge for notices with rainbow animation */}
                {item.badge !== undefined && item.badge > 0 && (
                  isCollapsed ? (
                    <span className="absolute -top-1 -right-1 rainbow-badge w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                      {item.badge}
                    </span>
                  ) : (
                    <span className="ml-auto rainbow-badge px-2 py-0.5 rounded-full text-[10px] font-bold text-white min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-start px-4'} py-3 rounded-xl transition-colors font-medium mb-1 ${activeTab === 'settings'
            ? 'bg-blue-50 dark:bg-neutral-800 text-blue-600 dark:text-neutral-100'
            : 'text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800/50 hover:text-gray-900 dark:hover:text-neutral-200'
            }`}
          title={isCollapsed ? 'Settings' : ''}
        >
          <Settings size={20} />
          {!isCollapsed && <span className="ml-3 whitespace-nowrap">Settings</span>}
        </button>
        <button
          onClick={onLogout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-start px-4'} py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-medium`}
          title={isCollapsed ? 'Log Out' : ''}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="ml-3 whitespace-nowrap">Log Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;