import React, { useState } from 'react';
import { Mail, Phone, ArrowRight, Loader2, CheckCircle, Shield } from 'lucide-react';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [step, setStep] = useState<'id' | 'otp'>('id');
    const [studentId, setStudentId] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [maskedContact, setMaskedContact] = useState('');

    // Simulate sending OTP
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!studentId.trim()) {
            setError('Please enter your Student ID');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate masking the contact info
        setMaskedContact('ra***@niu.edu.in / ******7890');
        setIsLoading(false);
        setStep('otp');
    };

    // Handle OTP input
    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    // Handle OTP paste
    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        const newOtp = [...otp];
        pastedData.split('').forEach((char, index) => {
            if (index < 6) newOtp[index] = char;
        });
        setOtp(newOtp);
    };

    // Handle OTP verification
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setError('Please enter the complete 6-digit OTP');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // For demo, accept any 6-digit OTP
        setIsLoading(false);
        onLoginSuccess();
    };

    // Handle back to ID step
    const handleBack = () => {
        setStep('id');
        setOtp(['', '', '', '', '', '']);
        setError('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex items-center justify-center p-4">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <img
                            src="/niu-logo.png"
                            alt="NIU Logo"
                            className="h-20 w-auto object-contain"
                            onError={(e) => {
                                // Fallback if image doesn't load
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                        {/* Fallback logo placeholder */}
                        <div className="hidden flex-col items-center">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                NIU
                            </div>
                        </div>
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/20 border border-white/50 dark:border-neutral-800 overflow-hidden">
                    {/* Header */}
                    <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 text-center border-b border-gray-100 dark:border-neutral-800">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <Shield size={24} className="sm:hidden" />
                            <Shield size={28} className="hidden sm:block" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                            {step === 'id' ? 'Student Login' : 'Verify OTP'}
                        </h1>
                        <p className="text-gray-500 dark:text-neutral-400 text-xs sm:text-sm">
                            {step === 'id'
                                ? 'Enter your Student ID to continue'
                                : 'Enter the 6-digit code sent to your registered contact'}
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-6 sm:p-8">
                        {step === 'id' ? (
                            <form onSubmit={handleSendOtp} className="space-y-4 sm:space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                        Student ID
                                    </label>
                                    <input
                                        type="text"
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                                        placeholder="e.g., RA2211003010XXX"
                                        className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center font-mono text-base sm:text-lg tracking-wider"
                                        autoFocus
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                                        <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            <span>Sending OTP...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Get OTP</span>
                                            <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                {/* OTP sent notification */}
                                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-green-800 dark:text-green-300 text-sm font-medium">OTP Sent Successfully!</p>
                                            <p className="text-green-600 dark:text-green-400 text-xs mt-1 flex items-center gap-1.5">
                                                <Mail size={12} />
                                                <Phone size={12} />
                                                {maskedContact}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Student ID display */}
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 dark:text-neutral-500 mb-1">Logging in as</p>
                                    <p className="font-mono font-semibold text-gray-900 dark:text-white">{studentId}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-3 text-center">
                                        Enter OTP
                                    </label>
                                    <div className="flex justify-center gap-1.5 sm:gap-2" onPaste={handleOtpPaste}>
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                id={`otp-${index}`}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Backspace' && !digit && index > 0) {
                                                        const prevInput = document.getElementById(`otp-${index - 1}`);
                                                        prevInput?.focus();
                                                    }
                                                }}
                                                className="w-10 h-12 sm:w-12 sm:h-14 rounded-lg sm:rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-center text-lg sm:text-xl font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                autoFocus={index === 0}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                                        <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            <span>Verifying...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Login</span>
                                            <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>

                                {/* Back & Resend */}
                                <div className="flex items-center justify-between pt-2">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors"
                                    >
                                        ← Change ID
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOtp(['', '', '', '', '', '']);
                                            // Simulate resend
                                        }}
                                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-400 dark:text-neutral-600 text-xs mt-6">
                    © 2026 Noida International University. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
