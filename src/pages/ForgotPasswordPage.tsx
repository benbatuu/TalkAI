import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../components/CustomInput';
import ModernButton from '../components/ModernButton';
import OTPModal from '../components/otp-modal';
import { useForgotPassword } from '../services/authService';

interface FormError {
    message: string;
}

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [localSuccess, setLocalSuccess] = useState<string | null>(null);

    const forgotPassword = useForgotPassword();

    useEffect(() => {
        if (forgotPassword.error) {
            const error = forgotPassword.error as FormError;
            setLocalError(error.message || 'Failed to send reset link');
            setLocalSuccess(null);
        } else if (forgotPassword.data?.success) {
            setLocalError(null);
            setLocalSuccess('Verification code sent to your email');
            setIsOtpModalOpen(true);
        }
    }, [forgotPassword.error, forgotPassword.data]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setLocalError(null);
        setLocalSuccess(null);
        forgotPassword.reset();

        if (!email.trim()) {
            setLocalError('Email address is required');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setLocalError('Please enter a valid email address');
            return;
        }

        forgotPassword.mutate(email);
    };

    const handleOtpVerified = (verifiedEmail: string) => {
        navigate(`/reset-password?email=${encodeURIComponent(verifiedEmail)}`);
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8 dark:bg-gray-900 dark:from-gray-800 dark:via-gray-900 dark:to-purple-900">
            <div className="flex bg-white shadow-2xl rounded-4xl overflow-hidden w-full max-w-4xl h-auto relative dark:bg-gray-800 dark:shadow-lg">
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                    <div className="mx-auto w-full max-w-sm">
                        <div className="space-y-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 dark:from-blue-700 dark:to-purple-700">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v3h8z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">Forgot Password?</h2>
                                <p className="text-gray-600 text-lg dark:text-gray-300">Don't worry, we'll help you reset it</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <CustomInput
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    icon={
                                        <svg className="w-5 h-5 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    }
                                />

                                {localError && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 dark:bg-red-900/30 dark:border-red-800/60">
                                        <p className="text-red-600 text-sm dark:text-red-300">{localError}</p>
                                    </div>
                                )}

                                {localSuccess && (
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 dark:bg-green-900/30 dark:border-green-800/60">
                                        <p className="text-green-600 text-sm dark:text-green-300">{localSuccess}</p>
                                    </div>
                                )}

                                <ModernButton type="submit" disabled={forgotPassword.isPending}>
                                    {forgotPassword.isPending ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Sending...
                                        </div>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </ModernButton>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/login')}
                                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 relative group"
                                    >
                                        Back to Login
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 hidden md:flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 p-8">
                    <div className="text-center text-white">
                        <h2 className="text-3xl font-bold mb-4">Remembered Your Password?</h2>
                        <p className="text-lg mb-8">Head back to login to access your account.</p>
                        <ModernButton variant="secondary" onClick={() => navigate('/login')}>
                            Login
                        </ModernButton>
                    </div>
                </div>
            </div>

            <OTPModal
                isOpen={isOtpModalOpen}
                onClose={() => setIsOtpModalOpen(false)}
                email={email}
                onOtpVerified={handleOtpVerified}
            />
        </div>
    );
};

export default ForgotPasswordPage;
