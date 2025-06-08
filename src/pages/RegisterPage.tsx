import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext'; // Artık doğrudan TanStack Query'den loading alabiliriz
import { useRegister } from '../services/authService'; // Doğru import
import OTPModal from '../components/otp-modal';
import TermsModal from '../components/terms-modal';
import PrivacyModal from '../components/privacy-modal';

const RegisterPage = () => {
    const navigate = useNavigate();
    // const { loading } = useAuth(); // Artık doğrudan TanStack Query'den alacağız

    const [signupFirstname, setSignupFirstname] = useState<string>('');
    const [signupLastname, setSignupLastname] = useState<string>('');
    const [signupEmail, setSignupEmail] = useState<string>('');
    const [signupPassword, setSignupPassword] = useState<string>('');
    const [localSignupError, setLocalSignupError] = useState<string | null>(null); // Yerel hata mesajı
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [registeredEmailForOtp, setRegisteredEmailForOtp] = useState<string>('');
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

    // TanStack Query'den kayıt mutasyonunu alın
    const {
        mutate: registerMutate,
        isPending: isRegistering, // Yükleme durumu
        isError: isRegisterError, // Hata durumu
        error: registerError, // Hata objesi
        isSuccess: isRegisterSuccess, // Başarı durumu
        reset: resetRegisterMutation // Mutasyon durumunu sıfırlamak için
    } = useRegister();

    // Kayıt mutasyonunun sonuçlarını izle ve yerel state'i güncelle
    useEffect(() => {
        if (isRegisterError) {
            setLocalSignupError((registerError)?.message || 'Registration failed. Please try again.');
        } else if (isRegisterSuccess) {
            // Kayıt başarılı olduğunda OTP modal'ı aç
            setRegisteredEmailForOtp(signupEmail);
            setIsOtpModalOpen(true);
            // Formu temizle
            setSignupFirstname('');
            setSignupLastname('');
            setSignupEmail('');
            setSignupPassword('');
            setLocalSignupError(null);
            resetRegisterMutation(); // Mutasyonu sıfırla
        }
    }, [isRegisterError, registerError, isRegisterSuccess, signupEmail, resetRegisterMutation]);


    const handleSignupSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLocalSignupError(null); // Önceki hataları temizle
        resetRegisterMutation(); // Mutasyonun önceki durumunu sıfırla

        // Basit client-side validasyonları
        if (!signupFirstname || !signupLastname || !signupEmail || !signupPassword) {
            setLocalSignupError('Please fill in all required fields.');
            return;
        }
        if (signupPassword.length < 6) {
            setLocalSignupError('Password must be at least 6 characters long.');
            return;
        }
        // E-posta formatı kontrolü eklenebilir

        try {
            const userData = {
                firstname: signupFirstname,
                lastname: signupLastname,
                email: signupEmail,
                password: signupPassword
            };

            // TanStack Query mutasyonunu çağır
            await registerMutate(userData);
            // Başarı ve hata durumları useEffect tarafından yönetilecek
        } catch (err) {
            console.error('Signup submission failed:', err);
            // Hata zaten useEffect tarafından localSignupError'a atanacak
        }
    };

    const handleOtpVerified = () => {
        // OTP doğrulandıktan sonra login sayfasına yönlendir
        navigate('/login');
    };

    return (
        <div className="min-h-screen w-full flex relative overflow-hidden dark:bg-gray-900">
            {/* Left Section - Visual/Brand Area */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800 dark:from-green-800 dark:via-emerald-900 dark:to-teal-900"></div>

                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse dark:bg-white/5"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl dark:bg-teal-600/10"></div>
                        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-emerald-400/20 rounded-full blur-2xl animate-pulse dark:bg-emerald-600/10"></div>
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center text-center p-16 text-white">
                    <div className="max-w-lg">
                        <div className="mb-12">
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                Join our
                                <span className="block text-emerald-200">community</span>
                            </h3>
                            <p className="text-xl text-green-100 leading-relaxed">
                                Create your account and unlock access to personalized learning experiences designed just for you.
                            </p>
                        </div>

                        {/* Feature highlights */}
                        <div className="space-y-6">
                            <div className="flex items-center text-left">
                                <div className="w-3 h-3 bg-emerald-400 rounded-full mr-4 flex-shrink-0"></div>
                                <span className="text-green-100 text-lg">Personalized learning paths</span>
                            </div>
                            <div className="flex items-center text-left">
                                <div className="w-3 h-3 bg-teal-400 rounded-full mr-4 flex-shrink-0"></div>
                                <span className="text-green-100 text-lg">Expert-curated content</span>
                            </div>
                            <div className="flex items-center text-left">
                                <div className="w-3 h-3 bg-green-400 rounded-full mr-4 flex-shrink-0"></div>
                                <span className="text-green-100 text-lg">Achievement tracking</span>
                            </div>
                        </div>

                        {/* Already have account */}
                        <div className="mt-12 pt-8 border-t border-white/20">
                            <p className="text-green-100 mb-6 text-lg">Already have an account?</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="inline-flex items-center px-8 py-4 bg-white/20 hover:bg-white/30 border-2 border-white/30 hover:border-white/40 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm transform hover:scale-[1.02] active:scale-[0.98] text-lg cursor-pointer"
                            >
                                <span>Sign in instead</span>
                                <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom decorative element */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Right Section - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center relative bg-gradient-to-br from-gray-50 via-white to-slate-100 p-8 lg:p-16 dark:from-gray-800 dark:via-gray-900 dark:to-black">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-64 -left-64 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/5 to-pink-600/10 rounded-full blur-3xl animate-pulse dark:from-purple-800/10 dark:to-pink-900/15"></div>
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-cyan-500/5 to-blue-600/10 rounded-full blur-3xl dark:from-cyan-800/10 dark:to-blue-900/15"></div>
                    <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-full blur-2xl dark:from-green-800/15 dark:to-emerald-900/15"></div>
                </div>

                <div className="w-full max-w-lg relative z-10">
                    {/* Brand/Logo Area */}
                    <div className="mb-12">
                        <div className="flex items-center mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg shadow-green-600/25 mr-4 dark:shadow-green-800/30">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">YourApp</h1>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight dark:text-white">
                                Create your
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
                                    account
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed dark:text-gray-300">
                                Join thousands of learners already on their journey
                            </p>
                        </div>
                    </div>

                    {/* Register Form */}
                    <form onSubmit={handleSignupSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="group">
                                    <label htmlFor="signupFirstname" className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide uppercase dark:text-gray-200">
                                        First Name
                                    </label>
                                    <input
                                        id="signupFirstname"
                                        name="firstname"
                                        type="text"
                                        value={signupFirstname}
                                        onChange={(e) => setSignupFirstname(e.target.value)}
                                        required
                                        className="w-full px-4 py-4 bg-white/80 border-2 border-gray-200/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/60 transition-all duration-300 placeholder-gray-400 text-lg backdrop-blur-sm hover:bg-white/90 hover:border-gray-300/60 dark:bg-gray-700/80 dark:border-gray-600/60 dark:focus:ring-green-400/10 dark:focus:border-green-400/60 dark:placeholder-gray-500 dark:text-white dark:hover:bg-gray-700/90 dark:hover:border-gray-500/60"
                                        placeholder="First name"
                                    />
                                </div>
                                <div className="group">
                                    <label htmlFor="signupLastname" className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide uppercase dark:text-gray-200">
                                        Last Name
                                    </label>
                                    <input
                                        id="signupLastname"
                                        name="lastname"
                                        type="text"
                                        value={signupLastname}
                                        onChange={(e) => setSignupLastname(e.target.value)}
                                        required
                                        className="w-full px-4 py-4 bg-white/80 border-2 border-gray-200/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/60 transition-all duration-300 placeholder-gray-400 text-lg backdrop-blur-sm hover:bg-white/90 hover:border-gray-300/60 dark:bg-gray-700/80 dark:border-gray-600/60 dark:focus:ring-green-400/10 dark:focus:border-green-400/60 dark:placeholder-gray-500 dark:text-white dark:hover:bg-gray-700/90 dark:hover:border-gray-500/60"
                                        placeholder="Last name"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label htmlFor="signupEmail" className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide uppercase dark:text-gray-200">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <svg className="w-6 h-6 text-gray-400 group-focus-within:text-green-600 transition-all duration-300 dark:text-gray-500 dark:group-focus-within:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        id="signupEmail"
                                        name="email"
                                        type="email"
                                        value={signupEmail}
                                        onChange={(e) => setSignupEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                        className="w-full pl-14 pr-6 py-4 bg-white/80 border-2 border-gray-200/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/60 transition-all duration-300 placeholder-gray-400 text-lg backdrop-blur-sm hover:bg-white/90 hover:border-gray-300/60 dark:bg-gray-700/80 dark:border-gray-600/60 dark:focus:ring-green-400/10 dark:focus:border-green-400/60 dark:placeholder-gray-500 dark:text-white dark:hover:bg-gray-700/90 dark:hover:border-gray-500/60"
                                        placeholder="Enter your email address"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label htmlFor="signupPassword" className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide uppercase dark:text-gray-200">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <svg className="w-6 h-6 text-gray-400 group-focus-within:text-green-600 transition-all duration-300 dark:text-gray-500 dark:group-focus-within:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v3h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="signupPassword"
                                        name="password"
                                        type="password"
                                        value={signupPassword}
                                        onChange={(e) => setSignupPassword(e.target.value)}
                                        required
                                        autoComplete="new-password"
                                        className="w-full pl-14 pr-6 py-4 bg-white/80 border-2 border-gray-200/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/60 transition-all duration-300 placeholder-gray-400 text-lg backdrop-blur-sm hover:bg-white/90 hover:border-gray-300/60 dark:bg-gray-700/80 dark:border-gray-600/60 dark:focus:ring-green-400/10 dark:focus:border-green-400/60 dark:placeholder-gray-500 dark:text-white dark:hover:bg-gray-700/90 dark:hover:border-gray-500/60"
                                        placeholder="Create a strong password"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {localSignupError && (
                            <div className="bg-red-50/90 border-2 border-red-200/60 rounded-2xl p-5 backdrop-blur-sm dark:bg-red-900/30 dark:border-red-800/60">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-red-800 font-medium dark:text-red-300">{localSignupError}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Create Account Button */}
                        <button
                            type="submit"
                            disabled={isRegistering} // TanStack Query'den gelen loading durumunu kullan
                            className="w-full bg-gradient-to-r from-emerald-600 via-green-700 to-teal-700 hover:from-emerald-700 hover:via-green-800 hover:to-teal-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-600/25 hover:shadow-2xl hover:shadow-emerald-600/40 disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed text-lg cursor-pointer dark:from-emerald-700 dark:via-green-800 dark:to-teal-800 dark:hover:from-emerald-800 dark:hover:via-green-900 dark:disabled:from-gray-600 dark:disabled:to-gray-700"
                        >
                            {isRegistering ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mr-4"></div>
                                    <span className="font-semibold">Creating your account...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <span>Create your account</span>
                                    <svg className="w-6 h-6 ml-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                            )}
                        </button>

                        {/* Terms and Privacy */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600 leading-relaxed dark:text-gray-400">
                                By creating an account, you agree to our{' '}
                                <button type="button" onClick={() => setIsTermsModalOpen(true)} className="text-emerald-600 hover:text-emerald-700 font-medium dark:text-emerald-400 dark:hover:text-emerald-500">
                                    Terms of Service
                                </button>
                                {' '}and{' '}
                                <button type="button" onClick={() => setIsPrivacyModalOpen(true)} className="text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer dark:text-emerald-400 dark:hover:text-emerald-500">
                                    Privacy Policy
                                </button>
                                .
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            <OTPModal
                isOpen={isOtpModalOpen}
                onClose={() => setIsOtpModalOpen(false)}
                email={registeredEmailForOtp}
                onOtpVerified={handleOtpVerified} // OTP doğrulandıktan sonra login sayfasına yönlendirme
            />

            <TermsModal
                isOpen={isTermsModalOpen}
                onClose={() => setIsTermsModalOpen(false)}
            />

            <PrivacyModal
                isOpen={isPrivacyModalOpen}
                onClose={() => setIsPrivacyModalOpen(false)}
            />
        </div>
    );
};

export default RegisterPage;