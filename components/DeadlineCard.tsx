import React from 'react';
import { AlertCircle, Calendar, ChevronRight } from 'lucide-react';
import { Deadline } from '../types';

interface DeadlineCardProps {
  deadline: Deadline;
  onDeadlineClick?: (subjectCode: string) => void;
}

const DeadlineCard: React.FC<DeadlineCardProps> = ({ deadline, onDeadlineClick }) => {
  // Mocking multiple deadlines for the web view
  const deadlines = [
    deadline,
    { ...deadline, id: 'd2', title: 'Database Project', subject: 'CS-305', dueDate: new Date(Date.now() + 86400000 * 2), urgency: 'medium' },
    { ...deadline, id: 'd3', title: 'Calculus Quiz', subject: 'MATH-102', dueDate: new Date(Date.now() + 86400000 * 5), urgency: 'low' }
  ];

  const getTimeRemaining = (date: Date) => {
    const diff = date.getTime() - new Date().getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 24) return `${Math.floor(hours / 24)} days`;
    return `${hours} hrs`;
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gray-100 dark:border-neutral-800 shadow-sm h-full flex flex-col transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-800 dark:text-neutral-100 text-lg">Upcoming Deadlines</h3>
        <button className="p-2 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors">
          <Calendar size={20} />
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {deadlines.map((d: any) => (
          <div
            key={d.id}
            onClick={() => onDeadlineClick?.(d.subject)}
            className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-neutral-700"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${d.urgency === 'high' ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400' :
              d.urgency === 'medium' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400'
              }`}>
              <AlertCircle size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 dark:text-neutral-100 text-sm truncate">{d.title}</h4>
              <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 font-medium">{d.subject}</p>
            </div>
            <div className="text-right">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${d.urgency === 'high' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400'
                }`}>
                {getTimeRemaining(d.dueDate)}
              </span>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
};

export default DeadlineCard;