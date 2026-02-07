import React from 'react';
import {
  CreditCard,
  Ticket,
  PieChart,
  GraduationCap,
  BookText,
  ClipboardCheck,
  Code2,
  Trophy,
  Briefcase,
  Presentation,
  Factory
} from 'lucide-react';

interface QuickActionsProps {
  onActionTrigger?: (actionId: string) => void;
  feesDue?: number; // Amount due, 0 means paid
  pendingAssignments?: number; // Number of pending assignments, 0 means all done
  attendancePercent?: number; // Overall attendance percentage
}

const opportunityActions = [
  { id: 'o1', label: 'Hackathons', icon: <Code2 size={24} />, color: 'bg-violet-600', desc: 'Ongoing: HackWar' },
  { id: 'o2', label: 'Competitions', icon: <Trophy size={24} />, color: 'bg-yellow-500', desc: 'Debate & Quiz' },
  { id: 'o3', label: 'Internships', icon: <Briefcase size={24} />, color: 'bg-blue-600', desc: 'Apply Now' },
  { id: 'o4', label: 'Workshops', icon: <Presentation size={24} />, color: 'bg-rose-500', desc: 'AI/ML Bootcamp' },
  { id: 'o5', label: 'Ind. Visits', icon: <Factory size={24} />, color: 'bg-slate-600', desc: 'Next: Tech Park' },
];

const QuickActions: React.FC<QuickActionsProps> = ({ onActionTrigger, feesDue = 45000, pendingAssignments = 3, attendancePercent = 85 }) => {
  // Generate academic actions with dynamic status
  const academicActions = [
    { id: '1', label: 'Attendance', icon: <PieChart size={24} />, color: attendancePercent >= 75 ? 'bg-green-500' : 'bg-red-500', desc: `${attendancePercent}% Overall`, isUrgent: attendancePercent < 75 },
    {
      id: '2',
      label: 'Pay Fees',
      icon: <CreditCard size={24} />,
      color: feesDue > 0 ? 'bg-red-500' : 'bg-green-500',
      desc: feesDue > 0 ? `Due: ₹${feesDue.toLocaleString('en-IN')}` : 'All Paid ✓',
      isUrgent: feesDue > 0
    },
    { id: '3', label: 'Syllabus', icon: <BookText size={24} />, color: 'bg-teal-500', desc: 'View Course Plan', isUrgent: false },
    { id: '4', label: 'Support', icon: <Ticket size={24} />, color: 'bg-emerald-500', desc: '2 Open Tickets', isUrgent: false },
    {
      id: '5',
      label: 'Assignments',
      icon: <ClipboardCheck size={24} />,
      color: pendingAssignments > 0 ? 'bg-orange-500' : 'bg-green-500',
      desc: pendingAssignments > 0 ? `${pendingAssignments} Pending` : 'All Done ✓',
      isUrgent: pendingAssignments > 0
    },
    { id: '6', label: 'Exams', icon: <GraduationCap size={24} />, color: 'bg-pink-500', desc: 'Schedule', isUrgent: false },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Academic Utilities */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 sm:p-6 border border-gray-100 dark:border-neutral-800 shadow-sm transition-colors">
        <div className="mb-4 sm:mb-6">
          <h3 className="font-bold text-gray-800 dark:text-neutral-100 text-base sm:text-lg">Quick Actions</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {academicActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onActionTrigger?.(action.id)}
              className="flex flex-col items-start p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-neutral-800 hover:border-blue-200 dark:hover:border-neutral-600 hover:bg-blue-50/50 dark:hover:bg-neutral-800 transition-all group text-left relative overflow-hidden active:scale-[0.98]"
            >
              <div className={`${action.color} w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white shadow-sm mb-2 sm:mb-3 group-hover:scale-110 transition-transform relative z-10`}>
                {action.icon}
              </div>
              <span className="font-semibold text-gray-800 dark:text-neutral-200 text-xs sm:text-sm relative z-10">{action.label}</span>
              <span className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 relative z-10 font-medium truncate max-w-full ${action.isUrgent
                ? 'text-red-500 dark:text-red-400'
                : 'text-gray-500 dark:text-neutral-500'
                }`}>
                {action.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 sm:p-6 border border-gray-100 dark:border-neutral-800 shadow-sm transition-colors">
        <div className="mb-4 sm:mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Trophy size={18} className="text-yellow-700 dark:text-yellow-500" />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-neutral-100 text-base sm:text-lg">Opportunities</h3>
          </div>
          <button className="text-xs sm:text-sm text-blue-600 dark:text-neutral-400 font-medium hover:underline hover:text-blue-700 dark:hover:text-neutral-300">View All</button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
          {opportunityActions.map((action) => (
            <button
              key={action.id}
              className="flex flex-col items-center p-2 sm:p-4 rounded-xl border border-gray-100 dark:border-neutral-800 hover:border-yellow-200 dark:hover:border-neutral-600 hover:bg-yellow-50/30 dark:hover:bg-neutral-800 transition-all group text-center active:scale-[0.98]"
            >
              <div className={`${action.color} w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-md mb-2 sm:mb-3 group-hover:-translate-y-1 transition-transform`}>
                {action.icon}
              </div>
              <span className="font-semibold text-gray-800 dark:text-neutral-200 text-[10px] sm:text-sm leading-tight">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;