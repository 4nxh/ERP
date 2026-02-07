import React, { useState } from 'react';
import { X, Info, CreditCard, Calendar, Check, AlertCircle, ChevronDown, ChevronUp, Sparkles, Smartphone, Landmark, GraduationCap, BookOpen, Globe } from 'lucide-react';

interface FeesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FeesModal: React.FC<FeesModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    // State for Academic Fee Installment
    const [payFullAcademic, setPayFullAcademic] = useState(true);

    // State for expanded details
    const [expandedFine, setExpandedFine] = useState<string | null>(null);
    const [expandedAcademic, setExpandedAcademic] = useState(false);

    // Fee structure constants
    const FEES = {
        tuition: { full: 45000, half: 22500 },
        activity: 2500,
        exam: 1800,
        language: 3500,
        fine: 750,
        scholarship: 5000
    };

    // State for selected items
    const [selectedItems, setSelectedItems] = useState({
        academicBundle: true, // Controls Tuition, Activity, Exam (Mandatory)
        language: true,       // Optional inside Academic
        fine: true
    });

    const toggleItem = (key: keyof typeof selectedItems) => {
        setSelectedItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Calculate Components
    const tuitionAmount = payFullAcademic ? FEES.tuition.full : FEES.tuition.half;

    // Academic Bundle Total (Displayed on the card)
    // If Bundle is unchecked, these are 0.
    // If Bundle is checked, Tuition + Activity + Exam are added.
    // Language is distinct but visually nested.

    const currentTuition = selectedItems.academicBundle ? tuitionAmount : 0;
    const currentActivity = selectedItems.academicBundle ? FEES.activity : 0;
    const currentExam = selectedItems.academicBundle ? FEES.exam : 0;
    const currentLanguage = (selectedItems.academicBundle && selectedItems.language) ? FEES.language : 0;

    const academicSectionTotal = currentTuition + currentActivity + currentExam + currentLanguage;

    const subtotal = (
        academicSectionTotal +
        (selectedItems.fine ? FEES.fine : 0)
    );

    // Scholarship
    const totalPayable = Math.max(0, subtotal - FEES.scholarship);

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] animate-slide-up-mobile sm:animate-scale-in overflow-hidden border border-gray-100 dark:border-neutral-800 font-sans">

                {/* Header */}
                <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 z-10 sticky top-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Due Fees</h2>
                        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">Select charges to proceed with payment</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors text-gray-600 dark:text-neutral-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="overflow-y-auto p-5 sm:p-6 space-y-8 flex-1 bg-[#F8FAFC] dark:bg-black/20">

                    {/* 1. Academic & Semester Fees (Consolidated) */}
                    <section>
                        <h3 className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider mb-4">Academic & Semester Fees</h3>

                        <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${selectedItems.academicBundle ? 'bg-white dark:bg-neutral-900 border-blue-200 dark:border-blue-900/30 ring-1 ring-blue-500/20' : 'bg-gray-50 dark:bg-neutral-900/50 border-gray-200 dark:border-neutral-800 opacity-70'}`}>

                            {/* Main Card Header */}
                            <div className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="pt-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.academicBundle}
                                            onChange={() => toggleItem('academicBundle')}
                                            className="w-5 h-5 rounded-md text-blue-600 border-gray-300 focus:ring-blue-500 bg-gray-100 dark:bg-neutral-800 dark:border-neutral-600 cursor-pointer"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold text-gray-900 dark:text-white">Academic Year 2025-26</span>
                                            <span className="font-mono font-medium text-gray-900 dark:text-white">₹{academicSectionTotal.toLocaleString()}</span>
                                        </div>

                                        {/* Installment Toggle */}
                                        {selectedItems.academicBundle && (
                                            <div className="mt-3 flex p-1 bg-gray-100 dark:bg-neutral-800 rounded-lg w-max">
                                                <button
                                                    onClick={() => setPayFullAcademic(true)}
                                                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${payFullAcademic ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700'}`}
                                                >
                                                    Pay Full
                                                </button>
                                                <button
                                                    onClick={() => setPayFullAcademic(false)}
                                                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${!payFullAcademic ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700'}`}
                                                >
                                                    Pay 50%
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Dropdown Trigger */}
                                {selectedItems.academicBundle && (
                                    <button
                                        onClick={() => setExpandedAcademic(!expandedAcademic)}
                                        className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 mt-4 px-2 hover:underline focus:outline-none"
                                    >
                                        {expandedAcademic ? 'Hide Breakdown' : 'View Fee Breakdown'}
                                        {expandedAcademic ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </button>
                                )}
                            </div>

                            {/* Nested Breakdown List */}
                            {selectedItems.academicBundle && expandedAcademic && (
                                <div className="border-t border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-800/20 p-4 space-y-3 animate-fade-in-down">

                                    {/* Tuition Fee Item */}
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                                <GraduationCap size={16} />
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300">Tuition Fee</span>
                                        </div>
                                        <span className="font-mono text-gray-900 dark:text-white">₹{tuitionAmount.toLocaleString()}</span>
                                    </div>

                                    {/* Activity Fee Item */}
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                                                <BookOpen size={16} />
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300">Activity Fee</span>
                                        </div>
                                        <span className="font-mono text-gray-900 dark:text-white">₹{FEES.activity.toLocaleString()}</span>
                                    </div>

                                    {/* Exam Fee Item */}
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                                                <Calendar size={16} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-gray-700 dark:text-gray-300">Exam Fee</span>
                                                <span className="text-[10px] text-orange-600 dark:text-orange-400 font-medium">Seasonal</span>
                                            </div>
                                        </div>
                                        <span className="font-mono text-gray-900 dark:text-white">₹{FEES.exam.toLocaleString()}</span>
                                    </div>

                                    {/* Foreign Language (Optional) */}
                                    <div className="flex items-center justify-between text-sm pt-2 border-t border-dashed border-gray-200 dark:border-neutral-700 mt-1">
                                        <div className="flex items-center gap-3">
                                            <div className="pt-0.5">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.language}
                                                    onChange={() => toggleItem('language')}
                                                    className="w-4 h-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                                    <Globe size={16} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-gray-700 dark:text-gray-300">Foreign Language</span>
                                                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">Elective</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="font-mono text-gray-900 dark:text-white">₹{FEES.language.toLocaleString()}</span>
                                    </div>

                                </div>
                            )}
                        </div>
                    </section>

                    {/* 2. Penalties & Adjustments (Dynamic) */}
                    <section>
                        <h3 className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider mb-4">Penalties & Adjustments</h3>
                        <div className="space-y-3">

                            {/* Library/Academic Fine */}
                            <div className={`p-4 rounded-2xl border bg-red-50/30 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 transition-all`}>
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.fine}
                                        onChange={() => toggleItem('fine')}
                                        className="w-5 h-5 rounded-md text-red-600 border-red-200 focus:ring-red-500 bg-white dark:bg-neutral-800 cursor-pointer mt-1"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-red-700 dark:text-red-400">Library & Academic Fine</span>
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setExpandedFine(expandedFine ? null : 'fine1')}
                                                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors text-red-500"
                                                    >
                                                        <Info size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <span className="font-mono font-bold text-red-600 dark:text-red-400">₹{FEES.fine.toLocaleString()}</span>
                                        </div>

                                        {/* Expandable Info */}
                                        {expandedFine === 'fine1' && (
                                            <div className="mt-3 p-3 bg-white dark:bg-neutral-900 rounded-xl border border-red-100 dark:border-red-900/30 text-xs shadow-sm animate-fade-in-down">
                                                <div className="flex items-start gap-2 text-gray-600 dark:text-neutral-400 mb-1">
                                                    <AlertCircle size={12} className="mt-0.5 text-orange-500" />
                                                    <span>Late return: "Introduction to Physics" (Lib) - ₹250</span>
                                                </div>
                                                <div className="flex items-start gap-2 text-gray-600 dark:text-neutral-400">
                                                    <AlertCircle size={12} className="mt-0.5 text-orange-500" />
                                                    <span>Late Submission: Lab Report 3 (Phy) - ₹500</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Scholarship */}
                            <div className="flex items-center gap-3 p-4 rounded-2xl border border-green-200 dark:border-green-900/30 bg-green-50/30 dark:bg-green-900/10">
                                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                                    <Sparkles size={12} />
                                </div>
                                <div className="flex-1 flex justify-between items-center">
                                    <div>
                                        <span className="font-semibold text-green-700 dark:text-green-400 block">Merit Scholarship Grant</span>
                                        <span className="text-[10px] text-green-600/80 dark:text-green-500/80">Applied to final amount</span>
                                    </div>
                                    <span className="font-mono font-bold text-green-600 dark:text-green-400">-₹{FEES.scholarship.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Sticky Footer - Action Area */}
                <div className="p-5 sm:p-6 bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800 z-20">
                    <div className="flex justify-between items-end mb-6">
                        <span className="text-sm font-medium text-gray-500 dark:text-neutral-500">Total Payable</span>
                        <div className="text-right">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">₹{totalPayable.toLocaleString()}</span>
                            {FEES.scholarship > 0 && subtotal > 0 && (
                                <span className="block text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                                    Includes ₹{FEES.scholarship.toLocaleString()} scholarship
                                </span>
                            )}
                        </div>
                    </div>

                    <button className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-gray-200 dark:hover:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                        <span>Pay Now</span>
                        <div className="w-px h-4 bg-gray-700 dark:bg-gray-300 mx-1"></div>
                        <div className="flex items-center gap-2 opacity-80">
                            <CreditCard size={18} />
                            <Smartphone size={18} />
                            <Landmark size={18} />
                        </div>
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes slide-up-mobile {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in-down {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up-mobile { animation: slide-up-mobile 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fade-in-down { animation: fade-in-down 0.2s ease-out; }
      `}</style>
        </div>
    );
};

export default FeesModal;
