import React, { useState } from 'react';
import { PieChart, Calendar, CheckCircle, XCircle, Clock, Flag, PartyPopper, SkipForward, BookOpen } from 'lucide-react';

// Sample attendance data
const attendanceData = {
    overall: {
        present: 85,
        absent: 15,
        totalClasses: 120,
        attendedClasses: 102,
    },
    subjects: [
        { name: 'Data Structures', code: 'CS301', present: 28, absent: 2, pending: 1, leave: 1, event: 0, total: 32 },
        { name: 'Database Systems', code: 'CS302', present: 25, absent: 3, pending: 0, leave: 2, event: 1, total: 31 },
        { name: 'Computer Networks', code: 'CS303', present: 22, absent: 4, pending: 2, leave: 1, event: 1, total: 30 },
        { name: 'Operating Systems', code: 'CS304', present: 27, absent: 1, pending: 0, leave: 1, event: 0, total: 29 },
        { name: 'Software Engineering', code: 'CS305', present: 20, absent: 5, pending: 1, leave: 2, event: 0, total: 28 },
    ],
    dateWise: [
        { date: new Date(2026, 1, 6), day: 'Thu', subject: 'Data Structures', code: 'CS301', status: 'present' },
        { date: new Date(2026, 1, 6), day: 'Thu', subject: 'Database Systems', code: 'CS302', status: 'present' },
        { date: new Date(2026, 1, 5), day: 'Wed', subject: 'Computer Networks', code: 'CS303', status: 'present' },
        { date: new Date(2026, 1, 5), day: 'Wed', subject: 'Operating Systems', code: 'CS304', status: 'absent' },
        { date: new Date(2026, 1, 4), day: 'Tue', subject: 'Software Engineering', code: 'CS305', status: 'present' },
        { date: new Date(2026, 1, 4), day: 'Tue', subject: 'Data Structures', code: 'CS301', status: 'present' },
        { date: new Date(2026, 1, 3), day: 'Mon', subject: 'Database Systems', code: 'CS302', status: 'leave' },
        { date: new Date(2026, 1, 3), day: 'Mon', subject: 'Computer Networks', code: 'CS303', status: 'present' },
        { date: new Date(2026, 1, 2), day: 'Sun', subject: 'Event', code: 'EVT', status: 'event' },
        { date: new Date(2026, 1, 1), day: 'Sat', subject: 'Operating Systems', code: 'CS304', status: 'present' },
        { date: new Date(2026, 0, 31), day: 'Fri', subject: 'Software Engineering', code: 'CS305', status: 'absent' },
        { date: new Date(2026, 0, 31), day: 'Fri', subject: 'Data Structures', code: 'CS301', status: 'present' },
        { date: new Date(2026, 0, 30), day: 'Thu', subject: 'Database Systems', code: 'CS302', status: 'pending' },
        { date: new Date(2026, 0, 30), day: 'Thu', subject: 'Computer Networks', code: 'CS303', status: 'present' },
    ]
};

// Calculate remaining skips to maintain 75% attendance
const calculateRemainingSkips = (attended: number, total: number): number => {
    // Formula: attended / (total + x) >= 0.75
    // Solving for x: x <= (attended / 0.75) - total
    const maxSkips = Math.floor((attended / 0.75) - total);
    return Math.max(0, maxSkips);
};

interface AttendanceSectionProps {
    onClose?: () => void;
}

const AttendanceSection: React.FC<AttendanceSectionProps> = () => {
    const { overall, subjects, dateWise } = attendanceData;
    const [viewMode, setViewMode] = useState<'subject' | 'date'>('subject');

    // Calculate percentages for pie chart
    const presentPercent = overall.present;
    const absentPercent = overall.absent;

    // Calculate remaining skips to maintain 75% attendance
    const remainingSkips = calculateRemainingSkips(overall.attendedClasses, overall.totalClasses);

    // SVG Pie Chart calculations
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const presentOffset = (presentPercent / 100) * circumference;
    const absentOffset = circumference - presentOffset;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                    <PieChart size={20} />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-neutral-100 tracking-tight">Attendance</h1>
                    <p className="text-gray-500 dark:text-neutral-400 text-sm">Track your class attendance</p>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pie Chart Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gray-100 dark:border-neutral-800 shadow-sm">
                    <h3 className="font-semibold text-gray-800 dark:text-neutral-100 mb-4">Overall Attendance</h3>

                    <div className="flex items-center justify-center">
                        <div className="relative">
                            <svg width="160" height="160" viewBox="0 0 180 180" className="-rotate-90 sm:w-[180px] sm:h-[180px]">
                                {/* Background circle */}
                                <circle
                                    cx="90"
                                    cy="90"
                                    r={radius}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="20"
                                    className="text-gray-100 dark:text-neutral-800"
                                />
                                {/* Present arc (green) */}
                                <circle
                                    cx="90"
                                    cy="90"
                                    r={radius}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="20"
                                    strokeDasharray={`${presentOffset} ${absentOffset}`}
                                    strokeLinecap="round"
                                    className="text-green-500 transition-all duration-1000"
                                />
                                {/* Absent arc (red) - starts after present */}
                                <circle
                                    cx="90"
                                    cy="90"
                                    r={radius}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="20"
                                    strokeDasharray={`${absentOffset} ${presentOffset}`}
                                    strokeDashoffset={-presentOffset}
                                    strokeLinecap="round"
                                    className="text-red-400 transition-all duration-1000"
                                />
                            </svg>
                            {/* Center text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{overall.present}%</span>
                                <span className="text-xs text-gray-500 dark:text-neutral-400">Present</span>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-neutral-400">Present ({presentPercent}%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-neutral-400">Absent ({absentPercent}%)</span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-gray-100 dark:border-neutral-800">
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-3">
                            <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{overall.attendedClasses}</p>
                        <p className="text-xs text-gray-500 dark:text-neutral-400">Classes Attended</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-gray-100 dark:border-neutral-800">
                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-3">
                            <XCircle size={20} className="text-red-600 dark:text-red-400" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{overall.totalClasses - overall.attendedClasses}</p>
                        <p className="text-xs text-gray-500 dark:text-neutral-400">Classes Missed</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-gray-100 dark:border-neutral-800">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-3">
                            <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{overall.totalClasses}</p>
                        <p className="text-xs text-gray-500 dark:text-neutral-400">Total Classes</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-gray-100 dark:border-neutral-800">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${remainingSkips > 0 ? 'bg-amber-100 dark:bg-amber-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                            <SkipForward size={20} className={remainingSkips > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'} />
                        </div>
                        <p className={`text-2xl font-bold ${remainingSkips > 0 ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'}`}>{remainingSkips}</p>
                        <p className="text-xs text-gray-500 dark:text-neutral-400">Remaining Skips</p>
                    </div>
                </div>
            </div>

            {/* Attendance Table with Toggle */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h3 className="font-semibold text-gray-800 dark:text-neutral-100">Attendance Details</h3>

                    {/* Toggle Buttons */}
                    <div className="flex bg-gray-100 dark:bg-neutral-800 rounded-xl p-1 w-full sm:w-auto">
                        <button
                            onClick={() => setViewMode('subject')}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${viewMode === 'subject'
                                ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300'
                                }`}
                        >
                            <BookOpen size={16} />
                            <span className="hidden xs:inline">Subject</span>
                            <span className="xs:hidden">Subject</span>
                        </button>
                        <button
                            onClick={() => setViewMode('date')}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${viewMode === 'date'
                                ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300'
                                }`}
                        >
                            <Calendar size={16} />
                            <span className="hidden xs:inline">Date</span>
                            <span className="xs:hidden">Date</span>
                        </button>
                    </div>
                </div>

                {/* Subject-wise Table */}
                {viewMode === 'subject' && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-neutral-800/50">
                                    <th className="text-left py-3 px-4 md:px-6 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Subject</th>
                                    <th className="text-center py-3 px-2 md:px-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-1">
                                            <CheckCircle size={14} className="text-green-500" />
                                            <span className="hidden sm:inline">Present</span>
                                        </div>
                                    </th>
                                    <th className="text-center py-3 px-2 md:px-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-1">
                                            <XCircle size={14} className="text-red-500" />
                                            <span className="hidden sm:inline">Absent</span>
                                        </div>
                                    </th>
                                    <th className="text-center py-3 px-2 md:px-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-1">
                                            <Clock size={14} className="text-amber-500" />
                                            <span className="hidden sm:inline">Pending</span>
                                        </div>
                                    </th>
                                    <th className="text-center py-3 px-2 md:px-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-1">
                                            <Flag size={14} className="text-blue-500" />
                                            <span className="hidden sm:inline">Leave</span>
                                        </div>
                                    </th>
                                    <th className="text-center py-3 px-2 md:px-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-1">
                                            <PartyPopper size={14} className="text-purple-500" />
                                            <span className="hidden sm:inline">Event</span>
                                        </div>
                                    </th>
                                    <th className="text-center py-3 px-2 md:px-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">%</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                                {subjects.map((subject, index) => {
                                    const percentage = Math.round((subject.present / subject.total) * 100);
                                    const isLow = percentage < 75;

                                    return (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-neutral-800/30 transition-colors">
                                            <td className="py-4 px-4 md:px-6">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white text-sm">{subject.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-neutral-500">{subject.code}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-2 md:px-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold text-sm">
                                                    {subject.present}
                                                </span>
                                            </td>
                                            <td className="py-4 px-2 md:px-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-semibold text-sm">
                                                    {subject.absent}
                                                </span>
                                            </td>
                                            <td className="py-4 px-2 md:px-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-semibold text-sm">
                                                    {subject.pending}
                                                </span>
                                            </td>
                                            <td className="py-4 px-2 md:px-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-semibold text-sm">
                                                    {subject.leave}
                                                </span>
                                            </td>
                                            <td className="py-4 px-2 md:px-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 font-semibold text-sm">
                                                    {subject.event}
                                                </span>
                                            </td>
                                            <td className="py-4 px-2 md:px-4 text-center">
                                                <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold ${isLow
                                                    ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                                    : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                                    }`}>
                                                    {percentage}%
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Date-wise Table */}
                {viewMode === 'date' && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-neutral-800/50">
                                    <th className="text-left py-3 px-4 md:px-6 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Date</th>
                                    <th className="text-left py-3 px-4 md:px-6 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Subject</th>
                                    <th className="text-center py-3 px-4 md:px-6 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                                {dateWise.map((record, index) => {
                                    const statusStyles: Record<string, string> = {
                                        present: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
                                        absent: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
                                        pending: 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
                                        leave: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
                                        event: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
                                    };

                                    const statusIcons: Record<string, React.ReactNode> = {
                                        present: <CheckCircle size={14} />,
                                        absent: <XCircle size={14} />,
                                        pending: <Clock size={14} />,
                                        leave: <Flag size={14} />,
                                        event: <PartyPopper size={14} />,
                                    };

                                    const formattedDate = record.date.toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    });

                                    return (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-neutral-800/30 transition-colors">
                                            <td className="py-4 px-4 md:px-6">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white text-sm">{formattedDate}</p>
                                                    <p className="text-xs text-gray-500 dark:text-neutral-500">{record.day}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 md:px-6">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white text-sm">{record.subject}</p>
                                                    <p className="text-xs text-gray-500 dark:text-neutral-500">{record.code}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 md:px-6 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${statusStyles[record.status]}`}>
                                                    {statusIcons[record.status]}
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceSection;
