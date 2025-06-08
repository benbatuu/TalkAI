import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import GoogleIcon from '../assets/icons/google.svg';
import FacebookIcon from '../assets/icons/facebook.svg';
import { useUser } from '../context/UserContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, loading } = useAuth();
    const { theme } = useTheme();
    const { user, loading: userLoading } = useUser();

    const [loginEmailOrUsername, setLoginEmailOrUsername] = useState<string>('');
    const [loginPassword, setLoginPassword] = useState<string>('');
    const [loginError, setLoginError] = useState<string>('');
    const [isLoginSuccess, setIsLoginSuccess] = useState<boolean>(false);

    const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoginError('');
        setIsLoginSuccess(false);

        try {
            await login({
                email: loginEmailOrUsername,
                password: loginPassword
            });
            setIsLoginSuccess(true);

        } catch {
            setLoginError('Login failed. Please check your credentials.');
        }
    };

    useEffect(() => {
        if (isLoginSuccess && user && !userLoading) {
            navigate('/');
        }
    }, [isLoginSuccess, user, userLoading, navigate]);

    const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <div className={`min-h-screen w-full flex relative overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            {/* Left Section - Login Form */}
            <div className={`w-full lg:w-1/2 flex items-center justify-center relative p-8 lg:p-16 ${isDarkMode ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black' : 'bg-gradient-to-br from-gray-50 via-white to-slate-100'}`}>
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute -top-64 -left-64 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${isDarkMode ? 'bg-gradient-to-br from-blue-800/10 to-indigo-900/15' : 'bg-gradient-to-br from-blue-500/5 to-indigo-600/10'}`}></div>
                    <div className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl ${isDarkMode ? 'bg-gradient-to-br from-purple-800/10 to-pink-900/15' : 'bg-gradient-to-br from-purple-500/5 to-pink-600/10'}`}></div>
                    <div className={`absolute top-1/4 right-1/4 w-32 h-32 rounded-full blur-2xl ${isDarkMode ? 'bg-gradient-to-br from-cyan-800/15 to-blue-900/15' : 'bg-gradient-to-br from-cyan-500/10 to-blue-600/10'}`}></div>
                </div>

                <div className="w-full max-w-lg relative z-10">
                    {/* Brand/Logo Area */}
                    <div className="mb-12">
                        <div className="flex items-center mb-8">
                            <div className={`w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg mr-4 ${isDarkMode ? 'shadow-blue-800/30' : 'shadow-blue-600/25'}`}>
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>YourApp</h1>
                        </div>
                        <div className="space-y-2">
                            <h2 className={`text-4xl lg:text-5xl font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Welcome
                                <span className={`block text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? 'from-blue-400 to-indigo-400' : 'from-blue-600 to-indigo-600'}`}>
                                    back
                                </span>
                            </h2>
                            <p className={`text-xl leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Sign in to continue your journey with us
                            </p>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLoginSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="group">
                                <label htmlFor="loginEmailOrUsername" className={`block text-sm font-semibold mb-3 tracking-wide uppercase ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                    Email or Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <svg className={`w-6 h-6 ${isDarkMode ? 'text-gray-500 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-600'} transition-all duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="loginEmailOrUsername"
                                        name="emailOrUsername"
                                        type="text"
                                        value={loginEmailOrUsername}
                                        onChange={(e) => setLoginEmailOrUsername(e.target.value)}
                                        required
                                        className={`w-full pl-14 pr-6 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:border-blue-500/60 transition-all duration-300 placeholder-gray-400 text-lg backdrop-blur-sm
                                        ${isDarkMode
                                                ? 'bg-gray-700/80 border-gray-600/60 focus:ring-blue-400/10 focus:border-blue-400/60 placeholder-gray-500 text-white hover:bg-gray-700/90 hover:border-gray-500/60'
                                                : 'bg-white/80 border-gray-200/60 focus:ring-blue-500/10 hover:bg-white/90 hover:border-gray-300/60'
                                            }`}
                                        placeholder="Enter your email or username"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <div className="flex justify-between items-center mb-3">
                                    <label htmlFor="loginPassword" className={`block text-sm font-semibold tracking-wide uppercase ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/forgot-password')}
                                        className={`text-sm font-semibold tracking-wide transition-all duration-200 relative uppercase group cursor-pointer ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`}
                                    >
                                        Forgot Password?
                                        <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}`}></span>
                                    </button>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <svg className={`w-6 h-6 ${isDarkMode ? 'text-gray-500 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-600'} transition-all duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v3h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="loginPassword"
                                        name="password"
                                        type="password"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required
                                        autoComplete="current-password"
                                        className={`w-full pl-14 pr-6 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:border-blue-500/60 transition-all duration-300 placeholder-gray-400 text-lg backdrop-blur-sm
                                        ${isDarkMode
                                                ? 'bg-gray-700/80 border-gray-600/60 focus:ring-blue-400/10 focus:border-blue-400/60 placeholder-gray-500 text-white hover:bg-gray-700/90 hover:border-gray-500/60'
                                                : 'bg-white/80 border-gray-200/60 focus:ring-blue-500/10 hover:bg-white/90 hover:border-gray-300/60'
                                            }`}
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {loginError && (
                            <div className={`border-2 rounded-2xl p-5 backdrop-blur-sm ${isDarkMode ? 'bg-red-900/30 border-red-800/60' : 'bg-red-50/90 border-red-200/60'}`}>
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className={`w-6 h-6 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className={`font-medium ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>{loginError}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed text-lg cursor-pointer
                            ${loading
                                    ? 'bg-gray-400 dark:bg-gray-600'
                                    : `${isDarkMode ? 'bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900' : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'}`
                                }
                            ${isDarkMode ? 'shadow-blue-800/25 hover:shadow-blue-800/40' : 'shadow-blue-600/25 hover:shadow-blue-600/40'}`
                            }
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mr-4"></div>
                                    <span className="font-semibold">Signing you in...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <span>Sign in to continue</span>
                                    <svg className="w-6 h-6 ml-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    </form>

                    {/* Social Login Buttons */}
                    <div className="flex justify-center gap-4 pt-8">
                        <button
                            type="button"
                            className={`p-4 rounded-xl border-2 transition-all duration-300 shadow-md transform hover:scale-[1.02] active:scale-[0.98]
                            ${isDarkMode ? 'bg-gray-700/80 border-gray-600/60 hover:bg-gray-700 hover:border-gray-500/60 shadow-gray-700/20 hover:shadow-gray-700/30' : 'bg-white/80 border-gray-200/60 hover:bg-white hover:border-gray-300/60 shadow-gray-200/20 hover:shadow-gray-300/30'}`}
                            title="Sign in with Google"
                        >
                            <div className="flex items-center">
                                <img src={GoogleIcon} alt="Google Icon" className="w-6 h-6" />
                                <span className={`ml-2 text-sm font-semibold tracking-wide transition-all duration-200 relative group cursor-pointer ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>Sign in with Google</span>
                            </div>
                        </button>
                        <button
                            type="button"
                            className={`p-4 rounded-xl border-2 transition-all duration-300 shadow-md transform hover:scale-[1.02] active:scale-[0.98]
                            ${isDarkMode ? 'bg-gray-700/80 border-gray-600/60 hover:bg-gray-700 hover:border-gray-500/60 shadow-gray-700/20 hover:shadow-gray-700/30' : 'bg-white/80 border-gray-200/60 hover:bg-white hover:border-gray-300/60 shadow-gray-200/20 hover:shadow-gray-300/30'}`}
                            title="Sign in with Facebook"
                        >
                            <div className="flex items-center">
                                <img src={FacebookIcon} alt="Facebook Icon" className="w-6 h-6" />
                                <span className={`ml-2 text-sm font-semibold tracking-wide transition-all duration-200 relative group cursor-pointer ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>Sign in with Facebook</span>
                            </div>
                        </button>
                    </div>


                    {/* Divider for social login */}
                    <div className="flex items-center justify-center my-8">
                        <div className={`flex-grow border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}></div>
                        <span className={`px-4 text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>OR</span>
                        <div className={`flex-grow border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}></div>
                    </div>
                    {/* Create New Account Button */}
                    <div className="text-center">
                        <button
                            onClick={() => navigate('/register')}
                            className={`inline-flex items-center px-8 py-4 border-2 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm transform hover:scale-[1.02] active:scale-[0.98] text-lg cursor-pointer
                                ${isDarkMode ? 'bg-gray-700/80 hover:bg-gray-700 border-gray-600/60 hover:border-gray-500/60 text-gray-200' : 'bg-white/80 hover:bg-white border-gray-200/60 hover:border-gray-300/60 text-gray-700'}`
                            }
                        >
                            <span>Create new account</span>
                            <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Section - Visual/Brand Area */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${isDarkMode ? 'from-blue-800 via-indigo-900 to-purple-900' : 'from-blue-600 via-indigo-700 to-purple-800'}`}></div>

                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full">
                        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${isDarkMode ? 'bg-white/5' : 'bg-white/10'}`}></div>
                        <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl ${isDarkMode ? 'bg-cyan-600/10' : 'bg-cyan-400/20'}`}></div>
                        <div className={`absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-2xl animate-pulse ${isDarkMode ? 'bg-indigo-600/10' : 'bg-indigo-400/20'}`}></div>
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center text-center p-16 text-white">
                    <div className="max-w-lg">
                        <div className="mb-12">
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                Start your
                                <span className="block text-cyan-200">learning journey</span>
                            </h3>
                            <p className="text-xl text-blue-100 leading-relaxed">
                                Join thousands of learners who are already mastering new skills with our innovative platform.
                            </p>
                        </div>

                        {/* Feature highlights */}
                        <div className="space-y-6">
                            <div className="flex items-center text-left">
                                <div className="w-3 h-3 bg-cyan-400 rounded-full mr-4 flex-shrink-0"></div>
                                <span className="text-blue-100 text-lg">Interactive learning experiences</span>
                            </div>
                            <div className="flex items-center text-left">
                                <div className="w-3 h-3 bg-indigo-400 rounded-full mr-4 flex-shrink-0"></div>
                                <span className="text-blue-100 text-lg">Progress tracking and analytics</span>
                            </div>
                            <div className="flex items-center text-left">
                                <div className="w-3 h-3 bg-purple-400 rounded-full mr-4 flex-shrink-0"></div>
                                <span className="text-blue-100 text-lg">Community-driven support</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom decorative element */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
        </div>
    );
};

export default LoginPage;
