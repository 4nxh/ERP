import React from 'react';
import { Home, BookOpen, User, PieChart } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', icon: <Home size={22} />, label: 'Home' },
    { id: 'attendance', icon: <PieChart size={22} />, label: 'Attendance' },
    { id: 'academics', icon: <BookOpen size={22} />, label: 'Academics' },
    { id: 'profile', icon: <User size={22} />, label: 'Profile' },
  ];

  return (
    <>
      <div className="md:hidden fixed bottom-6 left-0 right-0 px-4 z-50 pointer-events-none">
        <div className="pointer-events-auto bg-white/40 dark:bg-neutral-900/40 backdrop-blur-2xl border border-white/30 dark:border-neutral-700/40 shadow-2xl shadow-black/10 dark:shadow-black/40 rounded-full py-3 px-6 flex justify-between items-center max-w-sm mx-auto transition-colors"
          style={{
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            backdropFilter: 'blur(24px) saturate(180%)'
          }}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex items-center justify-center relative group"
              >
                <div className={`p-2.5 rounded-full transition-all ${isActive
                  ? 'px-5 bg-blue-600 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-lg shadow-blue-500/30 dark:shadow-none animate-bounce-up'
                  : 'text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300'
                  }`}>
                  {item.icon}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom animations for bounce */}
      <style>{`
        @keyframes bounce-up {
          0% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-12px);
          }
          50% {
            transform: translateY(-8px);
          }
          70% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(-8px);
          }
        }
        
        .animate-bounce-up {
          animation: bounce-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </>
  );
};

export default BottomNavigation;