import React, { useState } from 'react';
import { Bell, Menu, X, Home, PieChart, BookOpen, Bell as BellIcon, FileText, Settings, User, LogOut, GraduationCap, CreditCard, Clock } from 'lucide-react';
import { User as UserType, Notice } from '../types';

interface HeaderProps {
  user: UserType;
  onHomeClick?: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  notices: Notice[];
}

const Header: React.FC<HeaderProps> = ({ user, onHomeClick, activeTab, setActiveTab, notices = [] }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const newNotices = notices.filter(n => n.isNew);
  const newNoticesCount = newNotices.length;

  const navItems = [
    { id: 'home', icon: <Home size={20} />, label: 'Dashboard' },
    { id: 'attendance', icon: <PieChart size={20} />, label: 'Attendance' },
    { id: 'academics', icon: <BookOpen size={20} />, label: 'Academics' },
    { id: 'notices', icon: <BellIcon size={20} />, label: 'Notices', badge: newNoticesCount },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
    { id: 'profile', icon: <User size={20} />, label: 'Profile' },
  ];

  const handleNavClick = (tabId: string) => {
    if (setActiveTab) {
      setActiveTab(tabId);
    }
    setIsMobileMenuOpen(false);
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <>
      <header className="flex justify-between items-center py-3 px-4 md:py-4 md:px-8 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 sticky top-0 z-20 transition-colors">
        {/* Left Side - Hamburger Menu (Mobile) + Logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Button - Only on mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-neutral-300"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <button
            onClick={onHomeClick}
            className="flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
            title="Go to Dashboard"
          >
            <img
              src="/niu-logo.png"
              alt="NIU Logo"
              className="h-8 md:h-12 object-contain"
            />
          </button>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 md:gap-6 shrink-0 relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`relative p-2 md:p-2.5 rounded-full border transition-all ${isNotificationsOpen ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 hover:border-gray-300 text-gray-600 dark:text-neutral-300'}`}
          >
            <Bell size={20} />
            {newNoticesCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-neutral-800 animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute top-full right-0 mt-4 w-80 md:w-96 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 overflow-hidden z-50 animate-fade-in-up origin-top-right">
              <div className="p-4 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50/50 dark:bg-neutral-800/30">
                <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                {newNoticesCount > 0 && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">{newNoticesCount} New</span>
                )}
              </div>

              <div className="max-h-[320px] overflow-y-auto">
                {newNotices.length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-neutral-800">
                    {newNotices.map((notice) => (
                      <div key={notice.id} className="p-4 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group">
                        <div className="flex gap-3">
                          <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">{notice.title}</p>
                            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">{notice.description}</p>
                            <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400 font-medium">
                              <Clock size={12} />
                              <span>{getTimeAgo(notice.date)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center flex flex-col items-center justify-center text-gray-400 dark:text-neutral-500">
                    <Bell size={32} className="mb-2 opacity-20" />
                    <p className="text-sm">No new notifications</p>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-gray-100 dark:border-neutral-800 bg-gray-50/30 dark:bg-neutral-800/20 text-center">
                <button
                  onClick={() => {
                    setActiveTab?.('notices');
                    setIsNotificationsOpen(false);
                  }}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  View All Notices
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-gray-200 dark:border-neutral-800 relative">
            <div
              className="relative group cursor-pointer shrink-0"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <img
                src={user.avatarUrl}
                alt="Profile"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-white dark:border-neutral-700 shadow-sm group-hover:shadow-md transition-all"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-white dark:border-neutral-900"></div>
            </div>

            {/* Profile Popup Dialog */}
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-4 w-80 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 overflow-hidden z-50 animate-fade-in-up origin-top-right">
                {/* Header with decorative background */}
                <div className="h-20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 relative">
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 transition-colors text-gray-500 dark:text-neutral-400"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Profile Info */}
                <div className="px-5 pb-5 -mt-10">
                  <div className="relative inline-block">
                    <img
                      src={user.avatarUrl}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-neutral-900 shadow-md"
                    />
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-neutral-900"></div>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{user.name}</h3>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">Student</p>
                  </div>

                  <div className="mt-4 space-y-3">
                    {/* Class / Program */}
                    <div className="p-3 bg-gray-50 dark:bg-neutral-800/50 rounded-xl flex items-start gap-3">
                      <div className="p-2 bg-white dark:bg-neutral-800 rounded-lg text-blue-500 dark:text-blue-400 shadow-sm shrink-0">
                        <GraduationCap size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-neutral-500 uppercase tracking-wide">Class / Program</p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-neutral-200 mt-0.5 leading-snug">{user.program}</p>
                      </div>
                    </div>

                    {/* Enrollment ID */}
                    <div className="p-3 bg-gray-50 dark:bg-neutral-800/50 rounded-xl flex items-start gap-3">
                      <div className="p-2 bg-white dark:bg-neutral-800 rounded-lg text-purple-500 dark:text-purple-400 shadow-sm shrink-0">
                        <CreditCard size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-neutral-500 uppercase tracking-wide">Enrollment ID</p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-neutral-200 mt-0.5 font-mono">{user.studentId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800 flex justify-end">
                    <button
                      onClick={() => setIsProfileOpen(false)}
                      className="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            style={{
              WebkitBackdropFilter: 'blur(8px)',
              backdropFilter: 'blur(8px)'
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-in Menu with Frosted Glass */}
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-white/40 dark:bg-neutral-900/40 border-r border-white/30 dark:border-neutral-700/40 shadow-2xl animate-slide-in-left"
            style={{
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              backdropFilter: 'blur(24px) saturate(180%)'
            }}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-neutral-800">
              <img
                src="/niu-logo.png"
                alt="NIU Logo"
                className="h-10 object-contain"
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-neutral-300"
              >
                <X size={24} />
              </button>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-gray-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatarUrl}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 dark:border-neutral-700"
                />
                <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${isActive
                      ? 'bg-blue-50 dark:bg-neutral-800 text-blue-600 dark:text-white font-semibold'
                      : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800'
                      }`}
                  >
                    <span className={isActive ? 'text-blue-600 dark:text-white' : 'text-gray-400 dark:text-neutral-500'}>
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-neutral-800">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add animation keyframes */}
      <style>{`
        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
};

export default Header;