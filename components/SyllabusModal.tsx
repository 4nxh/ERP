import React, { useState } from 'react';
import { X, BookOpen, Download, ChevronDown, Check, ChevronUp, FileText } from 'lucide-react';

interface SyllabusModalProps {
    isOpen: boolean;
    onClose: () => void;
    subjects: { id: string; name: string; code: string }[];
}

interface SyllabusTopic {
    id: string;
    name: string;
    isCovered: boolean;
}

interface SyllabusModule {
    id: string;
    name: string;
    completion: number; // 0 to 100
    topics: SyllabusTopic[];
}

const MOCK_SYLLABUS_DATA: Record<string, SyllabusModule[]> = {
    'CS-201': [
        {
            id: 'm1',
            name: 'Introduction to Algorithms',
            completion: 100,
            topics: [
                { id: 't1', name: 'Analysis of Algorithms', isCovered: true },
                { id: 't2', name: 'Asymptotic Notations', isCovered: true },
                { id: 't3', name: 'Recursive Algorithms', isCovered: true }
            ]
        },
        {
            id: 'm2',
            name: 'Arrays & Linked Lists',
            completion: 80,
            topics: [
                { id: 't1', name: 'Singly Linked Lists', isCovered: true },
                { id: 't2', name: 'Doubly Linked Lists', isCovered: true },
                { id: 't3', name: 'Circular Linked Lists', isCovered: true },
                { id: 't4', name: 'Dynamic Arrays', isCovered: false }
            ]
        },
        {
            id: 'm3',
            name: 'Stacks & Queues',
            completion: 45,
            topics: [
                { id: 't1', name: 'Stack Implementation', isCovered: true },
                { id: 't2', name: 'Queue Implementation', isCovered: true },
                { id: 't3', name: 'Priority Queues', isCovered: false },
                { id: 't4', name: 'Applications of Stacks', isCovered: false }
            ]
        },
        {
            id: 'm4',
            name: 'Trees & Graphs',
            completion: 10,
            topics: [
                { id: 't1', name: 'Binary Trees', isCovered: true },
                { id: 't2', name: 'BST Operations', isCovered: false },
                { id: 't3', name: 'Graph Traversal', isCovered: false }
            ]
        },
        {
            id: 'm5',
            name: 'Hashing & Heaps',
            completion: 0,
            topics: [
                { id: 't1', name: 'Hash Functions', isCovered: false },
                { id: 't2', name: 'Collision Resolution', isCovered: false },
                { id: 't3', name: 'Min-Max Heaps', isCovered: false }
            ]
        },
        {
            id: 'm6',
            name: 'Dynamic Programming',
            completion: 0,
            topics: [
                { id: 't1', name: 'Overlapping Subproblems', isCovered: false },
                { id: 't2', name: 'Optimal Substructure', isCovered: false },
                { id: 't3', name: 'Knapsack Problem', isCovered: false }
            ]
        },
    ],
    'MATH-102': [
        {
            id: 'm1',
            name: 'Matrices & Determinants',
            completion: 100,
            topics: [
                { id: 't1', name: 'Matrix Operations', isCovered: true },
                { id: 't2', name: 'Inverse of Matrix', isCovered: true },
                { id: 't3', name: 'Rank of Matrix', isCovered: true }
            ]
        },
        {
            id: 'm2',
            name: 'Vector Spaces',
            completion: 60,
            topics: [
                { id: 't1', name: 'Linear Independence', isCovered: true },
                { id: 't2', name: 'Basis and Dimension', isCovered: true },
                { id: 't3', name: 'Subspaces', isCovered: false }
            ]
        },
        {
            id: 'm3',
            name: 'Linear Transformations',
            completion: 25,
            topics: [
                { id: 't1', name: 'Kernel and Range', isCovered: true },
                { id: 't2', name: 'Matrix Representation', isCovered: false }
            ]
        },
        {
            id: 'm4',
            name: 'Eigenvalues & Eigenvectors',
            completion: 0,
            topics: [
                { id: 't1', name: 'Characteristic Equation', isCovered: false },
                { id: 't2', name: 'Diagonalization', isCovered: false }
            ]
        },
    ],
    'CS-305': [
        {
            id: 'm1',
            name: 'Software Process Models',
            completion: 90,
            topics: [
                { id: 't1', name: 'Waterfall Model', isCovered: true },
                { id: 't2', name: 'Spiral Model', isCovered: true },
                { id: 't3', name: 'Agile vs Traditional', isCovered: false }
            ]
        },
        {
            id: 'm2',
            name: 'Agile Development',
            completion: 75,
            topics: [
                { id: 't1', name: 'Scrum Framework', isCovered: true },
                { id: 't2', name: 'User Stories', isCovered: true },
                { id: 't3', name: 'Sprint Planning', isCovered: false }
            ]
        },
        {
            id: 'm3',
            name: 'Requirements Engineering',
            completion: 30,
            topics: [
                { id: 't1', name: 'Functional Requirements', isCovered: true },
                { id: 't2', name: 'Use Case Diagrams', isCovered: false }
            ]
        },
        {
            id: 'm4',
            name: 'System Modeling',
            completion: 0,
            topics: [
                { id: 't1', name: 'Context Models', isCovered: false },
                { id: 't2', name: 'Interaction Models', isCovered: false }
            ]
        },
        {
            id: 'm5',
            name: 'Architectural Design',
            completion: 0,
            topics: [
                { id: 't1', name: 'MVC Pattern', isCovered: false },
                { id: 't2', name: 'Layered Architecture', isCovered: false }
            ]
        },
    ]
};

const SyllabusModal: React.FC<SyllabusModalProps> = ({ isOpen, onClose, subjects }) => {
    const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.code || '');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

    if (!isOpen) return null;

    const currentModules = MOCK_SYLLABUS_DATA[selectedSubjectId] || [];
    const selectedSubject = subjects.find(s => s.code === selectedSubjectId);

    const toggleModule = (moduleId: string) => {
        setExpandedModuleId(expandedModuleId === moduleId ? null : moduleId);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh] animate-slide-up-mobile sm:animate-scale-in overflow-hidden border border-gray-100 dark:border-neutral-800 font-sans">

                {/* Header */}
                <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Syllabus Tracker</h2>
                            <p className="text-sm text-gray-500 dark:text-neutral-400">Track your module progress</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors text-gray-600 dark:text-neutral-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto bg-[#F8FAFC] dark:bg-black/20 p-5 sm:p-8">

                    {/* Controls: Subject Selector & Download */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        {/* Subject Selector */}
                        <div className="relative flex-1">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full flex items-center justify-between p-3 pl-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl hover:border-blue-400 dark:hover:border-neutral-600 transition-colors"
                            >
                                <div className="flex flex-col items-start">
                                    <span className="text-xs text-gray-500 dark:text-neutral-500 font-medium uppercase tracking-wider">Subject</span>
                                    <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">{selectedSubject?.name || 'Select Subject'}</span>
                                </div>
                                <ChevronDown size={20} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-gray-100 dark:border-neutral-700 z-20 overflow-hidden animate-fade-in-down max-h-60 overflow-y-auto">
                                    {subjects.map((subject) => (
                                        <button
                                            key={subject.code}
                                            onClick={() => {
                                                setSelectedSubjectId(subject.code);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors flex items-center justify-between group"
                                        >
                                            <div>
                                                <p className={`font-medium ${selectedSubjectId === subject.code ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>{subject.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-neutral-500">{subject.code}</p>
                                            </div>
                                            {selectedSubjectId === subject.code && <Check size={16} className="text-blue-600 dark:text-blue-400" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Download Button */}
                        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                            <Download size={20} />
                            <span>Download PDF</span>
                        </button>
                    </div>

                    {/* Module List */}
                    <div className="space-y-6">
                        {currentModules.map((module, index) => (
                            <div key={module.id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm overflow-hidden">
                                <div
                                    className="p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                                    onClick={() => toggleModule(module.id)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-start gap-4">
                                            {/* Module Header Info */}
                                            <div>
                                                <span className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Module {index + 1}</span>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{module.name}</h3>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className={`text-sm font-bold ${module.completion === 100 ? 'text-green-500' : 'text-blue-600 dark:text-blue-400'}`}>
                                                {module.completion}%
                                            </span>
                                            <div className={`p-1 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400 transition-transform duration-300 ${expandedModuleId === module.id ? 'rotate-180' : ''}`}>
                                                <ChevronDown size={18} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Custom Progress Bar with Book Icon */}
                                    <div className="relative h-3 bg-gray-100 dark:bg-neutral-800 rounded-full w-full mt-2">
                                        {/* Fill */}
                                        <div
                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${module.completion}%` }}
                                        ></div>

                                        {/* Book Icon Anchor */}
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out z-10"
                                            style={{ left: `${module.completion}%`, transform: `translate(-50%, -50%)` }}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-white dark:bg-neutral-900 shadow-md border-2 border-blue-100 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                <BookOpen size={14} fill="currentColor" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Topics Dropdown (Accordion) */}
                                {expandedModuleId === module.id && (
                                    <div className="border-t border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-800/30 p-5 animate-fade-in-down">
                                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 ml-1">Topics Covered</h4>
                                        <div className="space-y-2">
                                            {module.topics.map((topic) => (
                                                <div key={topic.id} className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800/50">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${topic.isCovered ? 'bg-green-100 border-green-200 text-green-600 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' : 'border-gray-300 dark:border-neutral-700 text-transparent'}`}>
                                                        {topic.isCovered && <Check size={12} strokeWidth={3} />}
                                                    </div>
                                                    <span className={`text-sm ${topic.isCovered ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-gray-500 dark:text-neutral-500'}`}>
                                                        {topic.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {currentModules.length === 0 && (
                            <div className="text-center py-10 opacity-50">
                                <BookOpen size={48} className="mx-auto mb-4 text-gray-300 dark:text-neutral-600" />
                                <p>No syllabus data available for this subject.</p>
                            </div>
                        )}
                    </div>

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

export default SyllabusModal;
