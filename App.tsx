import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import QuickActions from './components/QuickActions';
import DeadlineCard from './components/DeadlineCard';
import Sidebar from './components/Sidebar';
import BottomNavigation from './components/BottomNavigation';
import AiAssistant from './components/AiAssistant';
import AttendanceSection from './components/AttendanceSection';
import LoginPage from './components/LoginPage';
import FeesModal from './components/FeesModal';
import StudentProfile from './components/StudentProfile';
import SyllabusModal from './components/SyllabusModal';
import AcademicsPage from './components/AcademicsPage';
import { CURRENT_USER, TODAY_CLASSES, UPCOMING_DEADLINES } from './constants';
import { MessageSquarePlus, Sun, Calendar, Moon, Bell, FileText, Download, Globe, Check, ChevronRight, ChevronDown } from 'lucide-react';
import { ClassSession } from './types';

// Notice interface and data
interface Notice {
  id: string;
  title: string;
  description: string;
  date: Date;
  isNew: boolean;
  hasAttachment?: boolean;
}

const INITIAL_NOTICES: Notice[] = [
  {
    id: 'n1',
    title: 'End Semester Examination',
    description: 'End semester examination dates have been announced. Please check the circular for detailed schedule, venue information, and guidelines. Make sure to carry your college ID card.',
    date: new Date(),
    isNew: true,
    hasAttachment: true
  },
  {
    id: 'n2',
    title: 'Fee Payment Reminder',
    description: 'Last date for fee payment is approaching. Pay before 15th Feb to avoid late fee charges. Online payment is available through the student portal.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isNew: true,
    hasAttachment: false
  },
  {
    id: 'n3',
    title: 'Library Hours Extended',
    description: 'Library will remain open till 10 PM during exam weeks. Additional reading rooms are also available on the ground floor.',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isNew: false,
    hasAttachment: false
  },
  {
    id: 'n4',
    title: 'Campus Placement Drive',
    description: 'Top tech companies will be visiting campus for recruitment. Register before 20th Feb. Eligible: Final year students with 60% and above.',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isNew: false,
    hasAttachment: true
  }
];

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
];

// Helper to parse time string "11:00 AM" for comparison
const parseTime = (timeStr: string): Date => {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentClass, setCurrentClass] = useState<ClassSession | null>(null);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [showFeesModal, setShowFeesModal] = useState(false);
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [greeting, setGreeting] = useState({ text: 'Good Morning', emoji: '👋', time: '' });
  const [filterNewNotices, setFilterNewNotices] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Global user profile state
  const [userProfile, setUserProfile] = useState({
    ...CURRENT_USER,
    studentPhoto: null as string | null,
    fatherPhoto: null as string | null,
    motherPhoto: null as string | null,
  });

  // Handler to update user profile from StudentProfile component
  const handleProfileUpdate = (updates: Partial<typeof userProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  // Calculate new notices count
  const newNoticesCount = notices.filter(n => n.isNew).length;

  // Update greeting based on time of day and language
  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

      let text = 'Good Morning';
      let emoji = '🌅';

      const localizedGreetings: Record<string, { morning: string; afternoon: string; evening: string; night: string }> = {
        en: { morning: 'Good Morning', afternoon: 'Good Afternoon', evening: 'Good Evening', night: 'Good Night' },
        hi: { morning: 'सुप्रभात', afternoon: 'शुभ दोपहर', evening: 'शुभ संध्या', night: 'शुभ रात्रि' },
        fr: { morning: 'Bonjour', afternoon: 'Bonne Après-midi', evening: 'Bonsoir', night: 'Bonne Nuit' },
        es: { morning: 'Buenos Días', afternoon: 'Buenas Tardes', evening: 'Buenas Tardes', night: 'Buenas Noches' },
        zh: { morning: '早上好', afternoon: '下午好', evening: '晚上好', night: '晚安' },
        ar: { morning: 'صباح الخير', afternoon: 'مساء الخير', evening: 'مساء الخير', night: 'تصبح على خير' },
      };

      const currentLangGreetings = localizedGreetings[language] || localizedGreetings['en'];

      if (hour >= 5 && hour < 12) {
        text = currentLangGreetings.morning;
        emoji = '🌅';
      } else if (hour >= 12 && hour < 17) {
        text = currentLangGreetings.afternoon;
        emoji = '☀️';
      } else if (hour >= 17 && hour < 21) {
        text = currentLangGreetings.evening;
        emoji = '🌆';
      } else {
        text = currentLangGreetings.night;
        emoji = '🌙';
      }

      setGreeting({ text, emoji, time: timeStr });
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [language]);

  // Mark a notice as read
  const markNoticeAsRead = (noticeId: string) => {
    setNotices(prev => prev.map(notice =>
      notice.id === noticeId ? { ...notice, isNew: false } : notice
    ));
  };

  // Determine current class based on real-time
  useEffect(() => {
    const checkCurrentClass = () => {
      const now = new Date();
      const active = TODAY_CLASSES.find(c => {
        const [startStr, endStr] = c.time.split(' - ');
        const start = parseTime(startStr);
        const end = parseTime(endStr);
        return now >= start && now <= end;
      });
      setCurrentClass(active || null);
    };

    checkCurrentClass();
    const interval = setInterval(checkCurrentClass, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleQuickAction = (actionId: string) => {
    if (actionId === '1') { // Attendance
      setActiveTab('attendance');
      setFilterNewNotices(false);
    } else if (actionId === '2') { // Pay Fees
      setShowFeesModal(true);
    } else if (actionId === '3') { // Syllabus
      setShowSyllabusModal(true);
    } else if (actionId === '5') { // Assignments
      setActiveTab('academics');
      setSelectedSubject(null);
    } else if (actionId === '6') { // Exams
      setActiveTab('academics');
      setSelectedSubject(null);
      // Scroll to exam details after a short delay for tab render
      setTimeout(() => {
        const examDetails = document.getElementById('exam-details');
        if (examDetails) {
          examDetails.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleDeadlineClick = (subjectCode: string) => {
    setActiveTab('academics');
    setSelectedSubject(subjectCode);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setFilterNewNotices(false);
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-black transition-colors duration-300 font-sans selection:bg-blue-100 dark:selection:bg-neutral-800">
      {/* Desktop Sidebar - Hidden on mobile */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        newNoticesCount={newNoticesCount}
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <BottomNavigation
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={userProfile}
          onHomeClick={() => handleTabChange('home')}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          notices={notices}
        />

        {/* Main Content Area - Added padding bottom for mobile nav */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-28 md:pb-10 scroll-smooth no-scrollbar">
          <div className="max-w-7xl mx-auto animate-fade-in space-y-6 md:space-y-8">
            {activeTab === 'home' && (
              <>
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-neutral-100 tracking-tight">
                    {greeting.text}, {userProfile.name.split(' ')[0]} {greeting.emoji}
                  </h1>
                  <p className="text-gray-500 dark:text-neutral-400 text-sm md:text-lg">Here's your academic overview for today.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                  {/* Left Column (Main) */}
                  <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
                    <div>
                      <HeroSection
                        currentClass={currentClass}
                        todayClasses={TODAY_CLASSES}
                        attendance={85}
                        onOpenAi={() => setIsAiOpen(true)}
                      />
                    </div>
                    <QuickActions onActionTrigger={handleQuickAction} />
                  </div>

                  {/* Right Column (Side widgets) */}
                  <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
                    <DeadlineCard
                      deadline={UPCOMING_DEADLINES[0]}
                      onDeadlineClick={handleDeadlineClick}
                    />

                    {/* Holidays / Events Widget */}
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-6 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-800 dark:text-neutral-100 text-lg">Holidays</h4>
                        <Calendar size={18} className="text-gray-400 dark:text-neutral-500" />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-4 p-3 rounded-xl bg-red-50/50 dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 flex items-center justify-center shrink-0">
                            <Sun size={20} />
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900 dark:text-neutral-200 text-sm">Makar Sankranti</h5>
                            <p className="text-xs text-gray-500 dark:text-neutral-500 mt-0.5">Wednesday, 14th Jan 2026</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 rounded-xl bg-orange-50/50 dark:bg-neutral-800 hover:bg-orange-50 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400 flex items-center justify-center shrink-0">
                            <Sun size={20} />
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900 dark:text-neutral-200 text-sm">Republic Day</h5>
                            <p className="text-xs text-gray-500 dark:text-neutral-500 mt-0.5">Monday, 26th Jan 2026</p>
                          </div>
                        </div>
                      </div>

                      <button className="w-full mt-4 py-2 text-xs font-semibold text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 transition-colors">
                        View Full Calendar
                      </button>
                    </div>


                  </div>
                </div>
              </>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-lg mx-auto w-full pt-4 md:pt-8 pb-20">
                {/* Section Header */}
                <div className="mb-6 px-1">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Appearance</h2>
                </div>

                {/* Settings Group */}
                <div className="bg-white dark:bg-[#18181B] rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden transition-colors">
                  {/* Dark Mode Row */}
                  <div className="p-5 flex items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800/30 transition-colors" onClick={() => setDarkMode(!darkMode)}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-neutral-400 shrink-0">
                        <Moon size={22} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-white text-base">Dark Mode</span>
                        <span className="text-xs text-gray-500 dark:text-neutral-500 mt-1 font-medium">Adjust the interface for low-light environments</span>
                      </div>
                    </div>

                    {/* Toggle */}
                    <div className="shrink-0 pl-2">
                      <div
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${darkMode ? 'bg-white' : 'bg-gray-200'
                          }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full shadow-md transition-transform duration-300 ${darkMode ? 'translate-x-7 bg-black' : 'translate-x-1 bg-white'
                            }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Language Section - Compact Dropdown */}
                <div className="mb-6 px-1 mt-8">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Language & Region</h2>
                </div>

                <div className="relative">
                  {/* Selected Language Box (Trigger) */}
                  <button
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className="w-full bg-white dark:bg-[#18181B] rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl shadow-sm rounded-full overflow-hidden w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-neutral-800">
                        {LANGUAGES.find(l => l.code === language)?.flag}
                      </span>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {LANGUAGES.find(l => l.code === language)?.native}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-neutral-500">
                          {LANGUAGES.find(l => l.code === language)?.name}
                        </p>
                      </div>
                    </div>
                    <div className={`text-gray-400 dark:text-neutral-500 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown size={20} />
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isLangMenuOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#18181B] rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 z-50 overflow-hidden animate-fade-in-down">
                      <div className="p-2 max-h-64 overflow-y-auto">
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setLanguage(lang.code);
                              setIsLangMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${language === lang.code
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-semibold'
                              : 'hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{lang.flag}</span>
                              <span className="text-sm">{lang.native}</span>
                            </div>
                            {language === lang.code && <Check size={16} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <AttendanceSection />
            )}

            {activeTab === 'notices' && (
              <>
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                        <Bell size={20} />
                      </div>
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-neutral-100 tracking-tight">Notices</h1>
                        <p className="text-gray-500 dark:text-neutral-400 text-sm">
                          {filterNewNotices ? 'Showing new notifications' : 'Stay updated with the latest announcements'}
                        </p>
                      </div>
                    </div>

                    {filterNewNotices && (
                      <button
                        onClick={() => setFilterNewNotices(false)}
                        className="px-4 py-2 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-lg text-sm font-medium transition-colors"
                      >
                        Show All
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid gap-4">
                  {(filterNewNotices ? notices.filter(n => n.isNew) : notices).map((notice) => (
                    <div
                      key={notice.id}
                      onClick={() => notice.isNew && markNoticeAsRead(notice.id)}
                      className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 ${notice.isNew
                        ? 'rainbow-border-glow bg-white dark:bg-neutral-900 hover:shadow-xl'
                        : 'bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 border border-gray-100 dark:border-neutral-800'
                        }`}
                    >
                      {notice.isNew && (
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full rainbow-dot"></div>
                      )}
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${notice.isNew
                          ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
                          : 'bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400'
                          }`}>
                          <FileText size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className={`text-base font-semibold ${notice.isNew
                                ? 'text-gray-900 dark:text-neutral-100'
                                : 'text-gray-700 dark:text-neutral-300'
                                }`}>
                                {notice.title}
                                {notice.isNew && (
                                  <span className="ml-2 rainbow-badge px-2 py-0.5 rounded-full text-[10px] font-bold text-white">NEW</span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-neutral-500 mt-1 leading-relaxed">
                                {notice.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-neutral-800">
                            <span className="text-xs text-gray-400 dark:text-neutral-600 font-medium">
                              {notice.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            {notice.hasAttachment && (
                              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                                <Download size={14} />
                                Download Circular
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'academics' && (
              <AcademicsPage selectedSubject={selectedSubject} />
            )}

            {activeTab === 'profile' && (
              <StudentProfile
                userProfile={userProfile}
                onProfileUpdate={handleProfileUpdate}
              />
            )}
          </div>
        </main>
      </div>

      {/* Floating Chat Trigger if Closed - Hidden on Mobile to avoid clash with nav, or moved up */}
      {!isAiOpen && (
        <button
          onClick={() => setIsAiOpen(true)}
          className="fixed bottom-24 md:bottom-8 right-4 md:right-8 w-12 h-12 md:w-14 md:h-14 bg-blue-600 hover:bg-blue-700 dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 text-white rounded-full shadow-xl shadow-blue-500/30 dark:shadow-none flex items-center justify-center transition-all hover:scale-105 z-40"
        >
          <MessageSquarePlus size={20} className="md:w-6 md:h-6" />
        </button>
      )}

      <AiAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
      <FeesModal isOpen={showFeesModal} onClose={() => setShowFeesModal(false)} />
      <SyllabusModal
        isOpen={showSyllabusModal}
        onClose={() => setShowSyllabusModal(false)}
        subjects={[
          { id: '1', name: 'Data Structures', code: 'CS-201' },
          { id: '2', name: 'Linear Algebra', code: 'MATH-102' },
          { id: '3', name: 'Software Engineering', code: 'CS-305' },
        ]}
      />
    </div>
  );
};

export default App;