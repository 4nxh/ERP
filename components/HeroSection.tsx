import React, { useState, useEffect } from 'react';
import { CheckCircle2, MapPin, Sparkles, Coffee, Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { ClassSession } from '../types';

interface HeroSectionProps {
    currentClass: ClassSession | null;
    todayClasses?: ClassSession[];
    attendance: number;
    onOpenAi: () => void;
}

// Helper to parse time string "11:00 AM" to Date object for today
const parseTime = (timeStr: string): Date => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
};

const HeroSection: React.FC<HeroSectionProps> = ({ currentClass, todayClasses = [], attendance, onOpenAi }) => {
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [progress, setProgress] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState('');

    // Reset checked in state when class changes
    useEffect(() => {
        if (currentClass) {
            setIsCheckedIn(currentClass.attendanceMarked);
        }
    }, [currentClass]);

    // Dynamic Progress Logic
    useEffect(() => {
        if (!currentClass) return;

        const updateProgress = () => {
            const now = new Date();
            const [startStr, endStr] = currentClass.time.split(' - ');

            try {
                const startTime = parseTime(startStr);
                const endTime = parseTime(endStr);

                const totalDuration = endTime.getTime() - startTime.getTime();
                const elapsed = now.getTime() - startTime.getTime();

                let p = (elapsed / totalDuration) * 100;
                p = Math.min(100, Math.max(0, p));
                setProgress(p);

                const remaining = endTime.getTime() - now.getTime();
                if (remaining > 0) {
                    const minutes = Math.ceil(remaining / (1000 * 60));
                    if (minutes >= 60) {
                        const hrs = Math.floor(minutes / 60);
                        const mins = minutes % 60;
                        setTimeRemaining(`${hrs}h ${mins}m left`);
                    } else {
                        setTimeRemaining(`${minutes}m left`);
                    }
                } else {
                    setTimeRemaining('Class ended');
                }
            } catch (e) {
                console.error("Error parsing time", e);
                setProgress(0);
                setTimeRemaining('');
            }
        };

        updateProgress();
        const interval = setInterval(updateProgress, 1000);
        return () => clearInterval(interval);
    }, [currentClass]);

    const handleCheckIn = () => {
        setIsCheckedIn(!isCheckedIn);
    };

    const getClassStatus = (timeRange: string) => {
        const [startStr, endStr] = timeRange.split(' - ');
        const now = new Date();
        const start = parseTime(startStr);
        const end = parseTime(endStr);

        if (now > end) return 'completed';
        if (now < start) return 'upcoming';
        return 'ongoing';
    };

    // Empty State / Schedule View Logic
    if (!currentClass) {
        // If no classes today at all (empty list), show fallback
        if (todayClasses.length === 0) {
            return (
                <div className="h-full">
                    <div className="relative overflow-hidden bg-white dark:bg-neutral-900 rounded-2xl shadow-xl shadow-blue-900/5 dark:shadow-none p-6 md:p-8 border border-gray-100 dark:border-neutral-800 h-full min-h-[360px] md:min-h-full flex flex-col justify-between group hover:border-blue-200 dark:hover:border-neutral-700 transition-all">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="p-2 md:p-3 bg-emerald-100/50 dark:bg-neutral-800 rounded-xl transition-colors">
                                    <Coffee size={18} className="text-emerald-600 dark:text-neutral-200" />
                                </div>
                                <div>
                                    <span className="font-bold text-gray-800 dark:text-neutral-100 block text-sm md:text-base">Free Time</span>
                                    <span className="text-[10px] md:text-xs text-gray-400 dark:text-neutral-500 font-medium">Relax & Recharge</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center items-center text-center py-6">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                <Clock size={32} className="text-gray-300 dark:text-neutral-600" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">No classes today</h2>
                            <p className="text-gray-500 dark:text-neutral-400 text-sm max-w-[220px]">Enjoy your free time!</p>
                        </div>
                    </div>
                </div>
            );
        }

        // Show Today's Schedule
        return (
            <div className="h-full">
                <div className="relative overflow-hidden bg-white dark:bg-neutral-900 rounded-2xl shadow-xl shadow-blue-900/5 dark:shadow-none p-6 md:p-8 border border-gray-100 dark:border-neutral-800 h-full min-h-[360px] md:min-h-full flex flex-col group hover:border-blue-200 dark:hover:border-neutral-700 transition-all">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 md:p-3 bg-blue-100/50 dark:bg-neutral-800 rounded-xl transition-colors">
                                <Calendar size={18} className="text-blue-600 dark:text-neutral-200" />
                            </div>
                            <div>
                                <span className="font-bold text-gray-800 dark:text-neutral-100 block text-sm md:text-base">Today's Schedule</span>
                                <span className="text-[10px] md:text-xs text-gray-400 dark:text-neutral-500 font-medium">Class Timeline</span>
                            </div>
                        </div>
                    </div>

                    {/* Schedule List */}
                    <div className="flex-1 overflow-y-auto -mr-2 pr-2 space-y-3 custom-scrollbar">
                        {todayClasses.map((cls, idx) => {
                            const status = getClassStatus(cls.time);
                            return (
                                <div key={idx} className={`p-3 md:p-4 rounded-xl border transition-all flex items-center justify-between group/item ${status === 'ongoing'
                                    ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800 shadow-sm'
                                    : 'bg-gray-50/50 dark:bg-neutral-800/30 border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800'
                                    }`}>
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${status === 'ongoing' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-neutral-500'
                                            }`}>
                                            {cls.time}
                                        </span>
                                        <span className={`font-semibold text-sm md:text-base truncate ${status === 'completed'
                                            ? 'text-gray-500 dark:text-neutral-400 line-through decoration-gray-300 dark:decoration-neutral-600'
                                            : 'text-gray-900 dark:text-white'
                                            }`}>
                                            {cls.subject}
                                        </span>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-neutral-500">
                                            <MapPin size={10} />
                                            <span>{cls.room}</span>
                                        </div>
                                    </div>

                                    <div className="shrink-0 pl-3">
                                        {status === 'completed' && (
                                            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${cls.attendanceMarked
                                                ? 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                                                : 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                                                }`}>
                                                {cls.attendanceMarked ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                <span className="text-[10px] font-bold">{cls.attendanceMarked ? 'Present' : 'Absent'}</span>
                                            </div>
                                        )}

                                        {status === 'ongoing' && (
                                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 animate-pulse">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                                                <span className="text-[10px] font-bold">Now</span>
                                            </div>
                                        )}

                                        {status === 'upcoming' && (
                                            <div className="px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-500 dark:text-neutral-400">
                                                <span className="text-[10px] font-bold">Upcoming</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    const [startTimeStr, endTimeStr] = currentClass.time.split(' - ');

    return (
        <div className="h-full">
            <div className="relative overflow-hidden bg-white dark:bg-neutral-900 rounded-2xl shadow-xl shadow-blue-900/5 dark:shadow-none p-6 md:p-8 border border-gray-100 dark:border-neutral-800 h-full min-h-[360px] md:min-h-full flex flex-col justify-between group hover:border-blue-200 dark:hover:border-neutral-700 transition-all">

                {/* Current Class Info */}
                <div className="flex-1 flex flex-col justify-center py-6">
                    <div className="flex items-center gap-2 text-gray-400 dark:text-neutral-500 mb-3 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span>Happening Now • <span className="text-green-600 dark:text-green-400">{timeRemaining}</span></span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight line-clamp-2 leading-tight">{currentClass.subject}</h2>
                    <div className="flex items-center text-gray-500 dark:text-neutral-400 text-xs md:text-sm gap-3 md:gap-4 flex-wrap">
                        <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-neutral-800 px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg border border-gray-100 dark:border-neutral-700">
                            <MapPin size={14} className="text-gray-400 dark:text-neutral-400" /> {currentClass.room}
                        </span>
                        <span className="bg-gray-50 dark:bg-neutral-800 px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg border border-gray-100 dark:border-neutral-700 font-medium text-gray-600 dark:text-neutral-300">
                            {currentClass.code}
                        </span>
                    </div>
                </div>

                {/* Timeline Visual (Dynamic) */}
                <div className="flex items-center gap-3 md:gap-6 mb-8 mt-2">
                    <span className="text-[10px] md:text-sm font-bold text-gray-900 dark:text-neutral-300 whitespace-nowrap">{startTimeStr}</span>
                    <div className="flex-1 h-1.5 md:h-2.5 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 dark:bg-neutral-100 rounded-full relative transition-all duration-1000 ease-linear"
                            style={{ width: `${progress}%` }}
                        >
                        </div>
                    </div>
                    <span className="text-[10px] md:text-sm font-medium text-gray-400 dark:text-neutral-500 whitespace-nowrap">{endTimeStr}</span>
                </div>

                {/* Action Row */}
                <div className="flex items-center pt-6 border-t border-gray-50 dark:border-neutral-800">
                    <div className="flex flex-col gap-2 w-full">
                        <span className="text-[10px] md:text-xs text-gray-400 dark:text-neutral-500 font-bold uppercase tracking-wide">Current Attendance</span>
                        <div className="flex items-center gap-3">
                            <div className="w-full h-2 md:h-2.5 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${attendance}%` }}
                                ></div>
                            </div>
                            <span className="text-xs md:text-sm font-bold text-gray-800 dark:text-neutral-200">{attendance}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;