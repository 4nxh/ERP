import React from 'react';
import { X } from 'lucide-react';
import { User } from '../types';

interface DigitalIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const DigitalIdModal: React.FC<DigitalIdModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      {/* Card Container - Enforcing Dark Mode look as per image */}
      <div className="relative w-full max-w-[340px] bg-[#18181B] rounded-[24px] shadow-2xl overflow-hidden flex flex-col text-white font-sans border border-neutral-800 ring-1 ring-white/10">
        
        {/* Header */}
        <div className="px-6 py-5 flex justify-between items-start bg-[#202025] border-b border-white/5">
            <div>
                <h2 className="text-lg font-bold tracking-tight text-white leading-none">UniSync University</h2>
                <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider mt-1.5">Student Identity Card</p>
            </div>
            <button 
                onClick={onClose}
                className="bg-neutral-700/50 p-1.5 rounded-full hover:bg-neutral-600 transition-colors text-neutral-400 hover:text-white"
            >
                <X size={16} />
            </button>
        </div>

        {/* Body Content */}
        <div className="px-6 pb-8 pt-6 overflow-y-auto max-h-[75vh] no-scrollbar">
            
            {/* Profile Section */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-neutral-700 shadow-xl mb-4">
                    <img 
                        src={user.avatarUrl} 
                        alt={user.name} 
                        className="w-full h-full object-cover"
                    />
                </div>
                <h1 className="text-xl font-bold text-white text-center mb-2 tracking-tight">{user.name}</h1>
                
                {/* Status Pill */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-green-900/40 bg-green-900/10 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <span className="text-[10px] font-bold text-green-500 tracking-wider">ACTIVE</span>
                    <span className="text-[10px] text-green-800">|</span>
                    <span className="text-[10px] font-bold text-green-500 font-mono tracking-wide">{user.studentId}</span>
                </div>
            </div>

            {/* Details Grid */}
            <div className="flex flex-col gap-5">
                
                {/* Department */}
                <div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mb-1">Department</p>
                    <p className="text-sm font-semibold text-neutral-200 leading-snug">{user.department}</p>
                </div>

                {/* School & System ID */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mb-1">School</p>
                        <p className="text-sm font-semibold text-neutral-200">{user.school}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mb-1">System ID</p>
                        <p className="text-sm font-semibold text-neutral-200">{user.studentId}</p>
                    </div>
                </div>

                {/* Email */}
                <div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mb-1">Email</p>
                    <p className="text-sm font-semibold text-neutral-200 break-all leading-tight">{user.email}</p>
                </div>

                {/* Program */}
                <div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mb-1">Program</p>
                    <p className="text-sm font-semibold text-neutral-200 leading-snug">{user.program}</p>
                </div>

                {/* Academic Year & Term */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mb-1">Academic Year</p>
                        <p className="text-sm font-semibold text-neutral-200">{user.academicYear}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mb-1">Term</p>
                        <p className="text-sm font-semibold text-neutral-200">{user.term}</p>
                    </div>
                </div>
                
                 {/* Semester & Status */}
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mb-1">Semester</p>
                        <p className="text-sm font-semibold text-neutral-200">{user.semester}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mb-1">Program Status</p>
                        <p className="text-sm font-semibold text-neutral-200">{user.programStatus}</p>
                    </div>
                </div>

                {/* Effective Date & Phone */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mb-1">Effective Date</p>
                        <p className="text-sm font-semibold text-neutral-200">{user.effectiveDate}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mb-1">Phone Number</p>
                        <p className="text-sm font-semibold text-neutral-200">{user.phoneNumber}</p>
                    </div>
                </div>

            </div>
        </div>

        {/* Footer Bar / Security Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
      </div>
    </div>
  );
};

export default DigitalIdModal;