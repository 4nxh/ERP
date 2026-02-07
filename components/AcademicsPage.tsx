import React, { useState } from 'react';
import {
    BookOpen,
    FileText,
    Upload,
    CheckCircle,
    Clock,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    Minus,
    Printer,
    Calendar,
    MapPin,
    FilePlus,
    ChevronRight,
    ExternalLink,
    ChevronDown,
    Filter
} from 'lucide-react';

// --- MOCK DATA BASED ON FRS ---
const ACADEMIC_DATA = {
    student_id: "2024277634",
    current_semester: 4,
    overall_attendance_percent: 68, // Intentionally < 75% to show lock state
    cgpa: 8.4,

    assessments: [
        {
            id: "ASKP-001",
            subject_code: "CS-201",
            type: "Assignment",
            title: "Data Structures Assignment",
            due_date: new Date(Date.now() + 86400000 * 3), // Due in 3 days (matches dashboard)
            status: "PENDING",
            submitted: false,
            marks: null,
            total_marks: 20,
            attachment_url: "/assignments/cs201_ds_impl.pdf"
        },
        {
            id: "ASKP-002",
            subject_code: "CS-305",
            type: "Lab Report",
            title: "Database Project",
            due_date: new Date(Date.now() + 86400000 * 2), // Due in 2 days (matches dashboard)
            status: "PENDING",
            submitted: false,
            marks: null,
            total_marks: 50,
            attachment_url: "/assignments/cs305_db.pdf"
        },
        {
            id: "ASKP-003",
            subject_code: "MATH-102",
            type: "Quiz",
            title: "Calculus Quiz",
            due_date: new Date(Date.now() + 86400000 * 5), // Due in 5 days (matches dashboard)
            status: "PENDING",
            submitted: false,
            marks: null,
            total_marks: 20,
            attachment_url: "/quizzes/math102_calc"
        },
        {
            id: "ASKP-004",
            subject_code: "CS-305",
            type: "Lab Report",
            title: "Software Requirements Spec",
            due_date: new Date(Date.now() - 86400000 * 2), // 2 days ago
            status: "OVERDUE",
            submitted: false,
            marks: null,
            total_marks: 10,
            attachment_url: "/assignments/cs305_srs.pdf"
        },
        {
            id: "ASKP-005",
            subject_code: "MATH-102",
            type: "Quiz",
            title: "Linear Algebra Basic Concepts",
            due_date: new Date(Date.now() - 86400000 * 5),
            status: "GRADED",
            submitted: true,
            marks: 18,
            total_marks: 20,
            attachment_url: "/quizzes/math102_basics"
        }
    ],

    exam_schedule: [
        {
            code: "CS-201",
            name: "Data Structures",
            date: "2026-03-10",
            time: "10:00 AM",
            room: "304",
            building: "Newton Block"
        },
        {
            code: "MATH-102",
            name: "Linear Algebra",
            date: "2026-03-12",
            time: "02:00 PM",
            room: "Hall 1",
            building: "SBM"
        },
        {
            code: "CS-305",
            name: "Software Engineering",
            date: "2026-03-14",
            time: "10:00 AM",
            room: "Lab 2",
            building: "Newton Block"
        },
        {
            code: "PHY-101",
            name: "Engineering Physics",
            date: "2026-03-16",
            time: "02:00 PM",
            room: "201",
            building: "SOAHS"
        },
        {
            code: "ENG-101",
            name: "Technical Communication",
            date: "2026-03-18",
            time: "10:00 AM",
            room: "105",
            building: "SBM"
        }
    ],

    academic_history: [
        { semester: 1, sgpa: 7.8 },
        { semester: 2, sgpa: 8.2 },
        { semester: 3, sgpa: 8.5 },
        // Current Sem 4 is in progress
    ]
};

interface AcademicsPageProps {
    selectedSubject?: string | null;
}

const AcademicsPage: React.FC<AcademicsPageProps> = ({ selectedSubject }) => {
    const [activeSegment, setActiveSegment] = useState<'overview' | 'assignments' | 'exams'>('overview');
    const [activeAssessmentFilter, setActiveAssessmentFilter] = useState('All');
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [isAssessmentsOpen, setIsAssessmentsOpen] = useState(true);

    // Effect to handle external subject selection (deep linking)
    React.useEffect(() => {
        if (selectedSubject) {
            setActiveAssessmentFilter('All');
            setIsAssessmentsOpen(true);
            // Optionally scroll to the item if we had refs, for now just ensuring visibility is good
        }
    }, [selectedSubject]);

    // Logic: GPA Trend
    const history = ACADEMIC_DATA.academic_history;
    const currentGPA = history[history.length - 1].sgpa;
    const previousGPA = history[history.length - 2].sgpa;
    const gpaDelta = (currentGPA - previousGPA).toFixed(2);
    const isPositiveTrend = parseFloat(gpaDelta) >= 0;

    // Logic: Exam Eligibility
    const isEligibleForExam = ACADEMIC_DATA.overall_attendance_percent >= 75;

    return (
        <div className="h-full flex flex-col space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Academics</h1>
                <p className="text-gray-500 dark:text-neutral-400 text-sm">Manage your academic journey, assignments, and exams.</p>
            </div>

            {/* Analytics & Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Academic Progress (Analytics Engine) */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gray-100 dark:border-neutral-800 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">CGPA Trend</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{ACADEMIC_DATA.cgpa}</h3>
                        </div>
                        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${isPositiveTrend ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                            {isPositiveTrend ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            <span>{isPositiveTrend ? '+' : ''}{gpaDelta}</span>
                        </div>
                    </div>

                    {/* Simple SVG Line Graph */}
                    <div className="h-32 w-full mt-4 flex items-end justify-between px-2 gap-2">
                        {history.map((sem, index) => (
                            <div key={sem.semester} className="flex flex-col items-center gap-2 flex-1 group/bar">
                                <div className="relative w-full flex justify-center h-24 items-end">
                                    <div
                                        className="w-full max-w-[40px] bg-blue-100 dark:bg-blue-900/20 rounded-t-lg group-hover/bar:bg-blue-200 dark:group-hover/bar:bg-blue-800/40 transition-all relative"
                                        style={{ height: `${(sem.sgpa / 10) * 100}%` }}
                                    >
                                        {/* Tooltip on hover */}
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                            {sem.sgpa}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-gray-400 dark:text-neutral-500">Sem {sem.semester}</span>
                            </div>
                        ))}
                        {/* Placeholder for Current Sem */}
                        <div className="flex flex-col items-center gap-2 flex-1 relative">
                            <div className="w-full max-w-[40px] h-24 border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-t-lg flex items-end justify-center">
                                <div className="w-full h-[50%] bg-gray-50 dark:bg-neutral-800/50"></div>
                            </div>
                            <span className="text-xs font-medium text-gray-400 dark:text-neutral-500">Sem {ACADEMIC_DATA.current_semester}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Exam Eligibility (Hall Ticket System) */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gray-100 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Exam Eligibility</p>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">End Semester Exams</h3>
                            </div>
                            <div className={`p-2 rounded-xl ${isEligibleForExam ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'}`}>
                                <Printer size={20} />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-4">
                            <div className="flex-1">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600 dark:text-neutral-400">Attendance</span>
                                    <span className={`font-bold ${isEligibleForExam ? 'text-green-600' : 'text-orange-500'}`}>{ACADEMIC_DATA.overall_attendance_percent}%</span>
                                </div>
                                {/* Progress Bar */}
                                <div className="h-2 w-full bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${isEligibleForExam ? 'bg-green-500' : 'bg-orange-500'}`}
                                        style={{ width: `${Math.min(100, ACADEMIC_DATA.overall_attendance_percent)}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-400 dark:text-neutral-500 mt-2">
                                    {isEligibleForExam
                                        ? "You are eligible to download your hall ticket."
                                        : `Requires 75% attendance. You are lagging by ${75 - ACADEMIC_DATA.overall_attendance_percent}%.`
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={!isEligibleForExam}
                        className={`w-full mt-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${isEligibleForExam
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-neutral-600 cursor-not-allowed'
                            }`}
                    >
                        {isEligibleForExam ? (
                            <>
                                <Printer size={18} /> Print Hall Ticket
                            </>
                        ) : (
                            <>
                                <AlertCircle size={18} /> Eligibility Locked
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Exam Details - Datesheet */}
            <div id="exam-details" className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gray-100 dark:border-neutral-800 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                            <Calendar size={22} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Exam Details</h3>
                            <p className="text-sm text-gray-500 dark:text-neutral-400">Semester {ACADEMIC_DATA.current_semester} Datesheet</p>
                        </div>
                    </div>
                    <button className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1">
                        Download <ExternalLink size={14} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-neutral-800">
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Subject</th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Date & Time</th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Room</th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Building</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ACADEMIC_DATA.exam_schedule.map((exam, index) => (
                                <tr key={exam.code} className={`border-b border-gray-50 dark:border-neutral-800/50 hover:bg-gray-50 dark:hover:bg-neutral-800/30 transition-colors ${index === 0 ? 'bg-purple-50/50 dark:bg-purple-900/10' : ''}`}>
                                    <td className="py-4 px-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900 dark:text-white">{exam.name}</span>
                                            <span className="text-xs text-gray-500 dark:text-neutral-500">{exam.code}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-800 dark:text-neutral-200">
                                                {new Date(exam.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-neutral-500">{exam.time}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-semibold">
                                            <MapPin size={12} /> {exam.room}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold ${exam.building === 'Newton Block' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' :
                                            exam.building === 'SBM' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' :
                                                'bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400'
                                            }`}>
                                            {exam.building}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800 flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-emerald-500"></span>
                        <span className="text-gray-600 dark:text-neutral-400">Newton Block</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-orange-500"></span>
                        <span className="text-gray-600 dark:text-neutral-400">SBM</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-violet-500"></span>
                        <span className="text-gray-600 dark:text-neutral-400">SOAHS</span>
                    </div>
                </div>
            </div>

            {/* 3. Assessments & Assignments (Task Engine) */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm overflow-hidden flex-1 transition-all duration-300">
                <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <button
                        onClick={() => setIsAssessmentsOpen(!isAssessmentsOpen)}
                        className="flex items-center gap-3 group text-left"
                    >
                        <div className={`p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 transition-colors group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30`}>
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Assessments</h3>
                                <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isAssessmentsOpen ? 'rotate-180' : ''}`} />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-neutral-400">Manage your submissions and grades</p>
                        </div>
                    </button>

                    {isAssessmentsOpen && (
                        <div className="relative animate-fade-in">
                            <button
                                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-neutral-800 rounded-lg text-sm font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                            >
                                <Filter size={16} />
                                <span>{activeAssessmentFilter}</span>
                                <ChevronDown size={16} className={`transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isFilterDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-gray-100 dark:border-neutral-800 py-1 z-10 animate-fade-in-up origin-top-right">
                                    {['All', 'Pending', 'Submitted', 'Graded'].map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() => {
                                                setActiveAssessmentFilter(filter);
                                                setIsFilterDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${activeAssessmentFilter === filter
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                                                : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800'
                                                }`}
                                        >
                                            {filter}
                                            {activeAssessmentFilter === filter && <CheckCircle size={14} />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {isAssessmentsOpen && (
                    <div className="divide-y divide-gray-100 dark:divide-neutral-800 animate-slide-down">
                        {ACADEMIC_DATA.assessments.filter(task => {
                            if (activeAssessmentFilter === 'All') return true;
                            if (activeAssessmentFilter === 'Pending') return !task.submitted;
                            if (activeAssessmentFilter === 'Submitted') return task.submitted;
                            if (activeAssessmentFilter === 'Graded') return task.status === 'GRADED';
                            return true;
                        }).map((task) => {
                            const isOverdue = new Date() > task.due_date && !task.submitted;
                            const daysLeft = Math.ceil((task.due_date.getTime() - Date.now()) / (1000 * 3600 * 24));

                            const isHighlighted = selectedSubject && task.subject_code === selectedSubject;

                            return (
                                <div
                                    key={task.id}
                                    className={`p-5 transition-all duration-500 group border-l-4 ${isHighlighted
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500'
                                        : 'hover:bg-gray-50 dark:hover:bg-neutral-800/50 border-transparent hover:border-gray-200 dark:hover:border-neutral-700'
                                        }`}
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${task.status === 'GRADED' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                                                task.type === 'Assignment' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                                                    'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                                                }`}>
                                                {task.status === 'GRADED' ? <CheckCircle size={20} /> : <FileText size={20} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold text-gray-500 dark:text-neutral-500 uppercase tracking-wide">{task.subject_code} • {task.type}</span>
                                                    {isOverdue && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">OVERDUE</span>}
                                                </div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white text-base">{task.title}</h4>
                                                <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1 flex items-center gap-2">
                                                    <Clock size={14} />
                                                    {task.submitted
                                                        ? `Submitted`
                                                        : `Due: ${task.due_date.toLocaleDateString()} (${daysLeft < 0 ? `${Math.abs(daysLeft)} days ago` : `${daysLeft} days left`})`
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                                            {task.status === 'GRADED' ? (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs text-gray-400 dark:text-neutral-500 font-medium">Score</span>
                                                    <span className="text-lg font-bold text-gray-900 dark:text-white">{task.marks} <span className="text-sm text-gray-400 font-normal">/ {task.total_marks}</span></span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                                    <button
                                                        onClick={() => window.open(task.attachment_url, '_blank')}
                                                        className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-300"
                                                    >
                                                        <ExternalLink size={16} />
                                                        {task.type === 'Quiz' ? 'Start Quiz' : 'View PDF'}
                                                    </button>

                                                    <button
                                                        disabled={isOverdue}
                                                        className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all w-full sm:w-auto justify-center ${isOverdue
                                                            ? 'bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-neutral-600 cursor-not-allowed'
                                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20'
                                                            }`}
                                                    >
                                                        {isOverdue ? <AlertCircle size={16} /> : <Upload size={16} />}
                                                        {isOverdue ? "Submission Closed" : "Submit Work"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 4. Leave Application (Workflow Section) - Simplified Teaser */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg group cursor-pointer relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-12 translate-x-10 group-hover:translate-x-0 transition-transform duration-500"></div>
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold">Request Academic Leave</h3>
                        <p className="text-blue-100 text-sm mt-1 max-w-md">Submit medical certificates or personal leave requests directly to your HOD for approval.</p>
                    </div>
                    <button className="px-5 py-2.5 bg-white text-blue-600 rounded-xl font-bold text-sm hover:shadow-xl transition-shadow flex items-center gap-2">
                        <FilePlus size={18} /> Apply Now
                    </button>
                </div>
            </div>

        </div>
    );
};

export default AcademicsPage;
