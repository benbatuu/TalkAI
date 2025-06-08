/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import ModernButton from './ModernButton';
import { useVerifyOTP, useResendOTP } from '../services/authService';

interface OTPModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    onOtpVerified: (email: string) => void;
}


const OTPModal: React.FC<OTPModalProps> = ({ isOpen, onClose, email, onOtpVerified }) => {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [localError, setLocalError] = useState<string | null>(null);
    const [localSuccess, setLocalSuccess] = useState<string | null>(null);

    const verifyOTP = useVerifyOTP();
    const resendOTP = useResendOTP();

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setOtp(Array(6).fill(''));
            setLocalError(null);
            setLocalSuccess(null);
            verifyOTP.reset();
            resendOTP.reset();
        }
    }, [isOpen]);

    // Handle verification success/error
    useEffect(() => {
        if (verifyOTP.error) {
            setLocalError(verifyOTP.error instanceof Error ? verifyOTP.error.message : 'OTP verification failed');
        } else if (verifyOTP.data?.success) {
            setLocalSuccess('OTP verified successfully!');
            setTimeout(() => {
                onOtpVerified(email);
                onClose();
            }, 1500);
        }
    }, [verifyOTP.error, verifyOTP.data, email, onOtpVerified, onClose]);

    // Handle resend success/error
    useEffect(() => {
        if (resendOTP.error) {
            setLocalError(resendOTP.error instanceof Error ? resendOTP.error.message : 'Failed to resend OTP');
        } else if (resendOTP.data?.success) {
            setLocalSuccess('OTP sent successfully! Check your email.');
        }
    }, [resendOTP.error, resendOTP.data]);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        setLocalError(null);
        setLocalSuccess(null);

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        } else if (!value && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const otpCode = otp.join('');

        if (otpCode.length !== 6) {
            setLocalError('Please enter the complete OTP code.');
            return;
        }

        setLocalError(null);
        setLocalSuccess(null);

        verifyOTP.mutate({ email, otpCode });
    };

    const handleResendOtp = () => {
        setLocalError(null);
        setLocalSuccess(null);
        resendOTP.mutate(email);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Enter OTP">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 dark:from-purple-700 dark:to-pink-700">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v3h8z" />
                    </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-300">We've sent a verification code to</p>
                <p className="text-gray-900 font-semibold dark:text-white">{email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center space-x-2">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Backspace' && !otp[index] && index > 0) {
                                    document.getElementById(`otp-${index - 1}`)?.focus();
                                }
                            }}
                            className="w-12 h-12 text-center text-xl font-semibold bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:bg-gray-800 dark:text-white"
                        />
                    ))}
                </div>

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

                <ModernButton type="submit" disabled={verifyOTP.isPending}>
                    {verifyOTP.isPending ? (
                        <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Verifying...
                        </div>
                    ) : (
                        'Verify OTP'
                    )}
                </ModernButton>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendOTP.isPending}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 dark:text-blue-400 dark:hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {resendOTP.isPending ? 'Resending...' : 'Resend Code'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default OTPModal;
