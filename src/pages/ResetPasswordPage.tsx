import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CustomInput from '../components/CustomInput';
import ModernButton from '../components/ModernButton';
import { useResetPassword } from '../services/authService';

interface FormError {
    message: string;
}

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);
    const [localSuccess, setLocalSuccess] = useState<string | null>(null);

    const resetPassword = useResetPassword();

    useEffect(() => {
        if (!token || !email) {
            setLocalError('Invalid reset link. Please use the link from your email.');
        }
    }, [token, email]);

    useEffect(() => {
        if (resetPassword.error) {
            const error = resetPassword.error as FormError;
            setLocalError(error.message || 'Failed to reset password. Please try again.');
            setLocalSuccess(null);
        } else if (resetPassword.data?.success) {
            setLocalSuccess('Password reset successful! Redirecting to login...');
            setLocalError(null);
            setTimeout(() => navigate('/login'), 2000);
        }
    }, [resetPassword.error, resetPassword.data, navigate]);

    const validatePassword = (pass: string): string | null => {
        if (pass.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/[A-Z]/.test(pass)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/[a-z]/.test(pass)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!/[0-9]/.test(pass)) {
            return 'Password must contain at least one number';
        }
        return null;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        setLocalError(null);
        setLocalSuccess(null);
        resetPassword.reset();

        if (!token || !email) {
            setLocalError('Invalid reset link. Please use the link from your email.');
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setLocalError(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        resetPassword.mutate({ token, newPassword: password });
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8 dark:bg-gray-900 dark:from-gray-800 dark:via-gray-900 dark:to-purple-900">
            <div className="flex bg-white shadow-2xl rounded-4xl overflow-hidden w-full max-w-4xl h-auto relative dark:bg-gray-800 dark:shadow-lg">
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                    <div className="mx-auto w-full max-w-sm">
                        <div className="space-y-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 dark:from-green-700 dark:to-blue-700">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">Reset Password</h2>
                                <p className="text-gray-600 text-lg dark:text-gray-300">Create your new secure password</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <CustomInput
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="New Password"
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    icon={
                                        <svg className="w-5 h-5 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v3h8z" />
                                        </svg>
                                    }
                                />

                                <CustomInput
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    icon={
                                        <svg className="w-5 h-5 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

                                <ModernButton type="submit" disabled={resetPassword.isPending || !token}>
                                    {resetPassword.isPending ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Resetting...
                                        </div>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </ModernButton>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/login')}
                                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 relative group dark:text-blue-400 dark:hover:text-blue-500"
                                    >
                                        Back to Login
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full dark:bg-blue-400"></span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 hidden md:flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 p-8 dark:from-blue-800 dark:to-purple-800">
                    <div className="text-center text-white">
                        <h2 className="text-3xl font-bold mb-4">Password Reset Help</h2>
                        <p className="text-lg mb-8">Need assistance? Return to login and use the forgot password option.</p>
                        <ModernButton variant="secondary" onClick={() => navigate('/login')}>
                            Login
                        </ModernButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
