import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getAllLanguages } from '../services/languageService';
import { useUpdateProfile } from '../services/userService';
import { useResetPassword } from '../services/authService';
import { MdEdit, MdDeleteForever, MdNotifications } from "react-icons/md"; // Added MdNotifications, MdDeleteForever
import Modal from '../components/Modal';
import { ThemeSection } from '../components/theme-section';
import type { languageTypes } from '../types';

const ProfilePage = () => {
    const { user, logout } = useAuth(); // Destructure logout
    const { theme } = useTheme();
    const updateProfile = useUpdateProfile();
    const resetPassword = useResetPassword();

    // Modal states
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false); // New modal for delete account

    // Form states
    const [newFirstName, setNewFirstName] = useState(user?.firstname || '');
    const [newLastName, setNewLastName] = useState(user?.lastname || '');
    const [selectedLanguage, setSelectedLanguage] = useState(user?.learningLanguage || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);

    // Language states
    const [availableLanguages, setAvailableLanguages] = useState<languageTypes[]>([]);
    const [loadingLanguages, setLoadingLanguages] = useState(true);
    const [errorLanguages, setErrorLanguages] = useState<string | null>(null);

    // Update form and preferences when user data changes
    useEffect(() => {
        if (user) {
            setNewFirstName(user.firstname || '');
            setNewLastName(user.lastname || '');
            setSelectedLanguage(user.learningLanguage || '');
        }
    }, [user]);

    // Fetch languages
    useEffect(() => {
        const fetchLanguages = async () => {
            setLoadingLanguages(true);
            setErrorLanguages(null);
            try {
                const languages = await getAllLanguages();
                setAvailableLanguages(languages);
            } catch {
                setErrorLanguages('Failed to load languages. Please try again.');
                setAvailableLanguages([]);
            } finally {
                setLoadingLanguages(false);
            }
        };
        fetchLanguages();
    }, []);

    const validatePassword = (pass: string): string | null => {
        if (pass.length < 8) return 'Password must be at least 8 characters.';
        if (!/[A-Z]/.test(pass)) return 'Password must include at least one uppercase letter.';
        if (!/[a-z]/.test(pass)) return 'Password must include at least one lowercase letter.';
        if (!/[0-9]/.test(pass)) return 'Password must include at least one number.';
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return 'Password must include at least one special character.'; // Added special character validation
        return null;
    };

    const handleProfileUpdate = async () => {
        if (!user) return;
        setLocalError(null);

        if (!newFirstName.trim() || !newLastName.trim() || !selectedLanguage) {
            setLocalError('All fields are required.');
            return;
        }

        updateProfile.mutate({
            userId: user.id,
            data: {
                firstname: newFirstName,
                lastname: newLastName,
                learningLanguage: selectedLanguage,
            }
        }, {
            onSuccess: () => {
                setIsProfileModalOpen(false);
                setLocalError(null); // Clear error on success
            },
            onError: (error) => {
                setLocalError(error.message || 'Failed to update profile.');
            }
        });
    };

    const handlePasswordUpdate = async () => {
        if (!user?.email) return;
        setLocalError(null);

        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            setLocalError(passwordError);
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setLocalError('New passwords do not match.');
            return;
        }

        resetPassword.mutate({
            token: currentPassword, // This 'token' should ideally be the current password for verification.
            newPassword: newPassword
        }, {
            onSuccess: () => {
                setIsPasswordModalOpen(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                setLocalError(null); // Clear error on success
            },
            onError: (error) => {
                setLocalError(error.message || 'Failed to change password.');
            }
        });
    };

    const handleDeleteAccount = async () => {
        // This is a placeholder for your actual delete account logic.
        // You would typically call an API here to delete the user's account.
        // After successful deletion, log out the user and redirect.
        console.log('Attempting to delete account for user:', user?.email);
        try {
            // await deleteUserAccountService(user.id); // Replace with your actual service call
            await logout(); // Log out the user after deletion
            alert('Your account has been deleted.');
            // navigate('/register'); // Redirect to a registration or home page
        } catch (error) {
            console.error('Failed to delete account:', error);
            setLocalError('Failed to delete account. Please try again.');
        } finally {
            setIsDeleteAccountModalOpen(false);
        }
    };


    const getCurrentLanguageName = () => {
        if (!user?.learningLanguage) return 'No language selected';
        const language = availableLanguages.find(lang => lang.code === user.learningLanguage);
        return language ? language.name : user.learningLanguage;
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (!user) {
        return (
            <div className={`h-screen flex items-center justify-center text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} bg-gray-100 dark:bg-gray-900`}>
                User profile could not be loaded. Please log in again.
            </div>
        );
    }

    const cardClasses = `p-6 rounded-xl shadow-md transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 text-gray-100 shadow-gray-700/50' : 'bg-white text-gray-800 shadow-gray-300/50'}`;
    const buttonClasses = `px-4 py-2 rounded-lg font-medium transition-colors duration-200`;
    const primaryButtonClasses = `${buttonClasses} ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`;
    const secondaryButtonClasses = `${buttonClasses} ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`;
    const destructiveButtonClasses = `${buttonClasses} bg-red-600 text-white hover:bg-red-700`;
    const inputClasses = `w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'}`;

    return (
        <div className={`h-screen p-8 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-300 text-gray-800'}`}>
            <div className="mx-auto h-full space-y-8 overflow-auto pb-14">
                {/* User Info Card */}
                <div className={`${cardClasses} flex flex-col md:flex-row items-center justify-between`}>
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        {user.avatar ? (
                            <img src={user.avatar} alt="User Avatar" className="w-20 h-20 rounded-full object-cover border-4 border-blue-500" />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white border-4 border-blue-500">
                                {getInitials(user.firstname || 'U', user.lastname || 'A')}
                            </div>
                        )}
                        <div>
                            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.firstname} {user.lastname}</h2>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{user.email}</p>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                                Learning: <span className="font-semibold">{getCurrentLanguageName()}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsProfileModalOpen(true)}
                        className={`${primaryButtonClasses} flex items-center justify-center space-x-2`}
                    >
                        <MdEdit size={20} className="mr-2" />
                        Edit Profile
                    </button>
                </div>

                {/* Account Settings Card */}
                <div className={cardClasses}>
                    <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Account Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>First Name</label>
                            <input type="text" value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} className={inputClasses} disabled />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Last Name</label>
                            <input type="text" value={newLastName} onChange={(e) => setNewLastName(e.target.value)} className={inputClasses} disabled />
                        </div>
                        <div className="md:col-span-2">
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Email Address</label>
                            <input type="email" value={user.email} className={inputClasses} disabled />
                        </div>
                        <div className="md:col-span-2">
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Learning Language</label>
                            <input type="text" value={getCurrentLanguageName()} className={inputClasses} disabled />
                        </div>
                    </div>
                    <button onClick={() => setIsProfileModalOpen(true)} className={`${primaryButtonClasses} mt-6 flex items-center justify-center space-x-2"`}>
                        <MdEdit size={20} className="mr-2" />
                        Update Account Details
                    </button>
                </div>

                {/* Password & Security Card */}
                <div className={cardClasses}>
                    <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Password & Security</h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                        Regularly changing your password helps keep your account secure.
                    </p>
                    <button onClick={() => setIsPasswordModalOpen(true)} className={primaryButtonClasses}>
                        Change Password
                    </button>
                </div>

                {/* Preferences Card */}
                <div className={cardClasses}>
                    <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Preferences</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <MdNotifications size={24} className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mr-3`} />
                            <div>
                                <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Email Notifications</h4>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Receive updates, tips, and promotional emails.
                                </p>
                            </div>
                        </div>
                        <label htmlFor="toggle-notifications" className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id="toggle-notifications"
                                    className="sr-only"
                                    checked={false}
                                    onChange={() => {
                                        console.log('Toggle notifications');
                                    }}
                                />
                                <div className={`block w-14 h-8 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                                <div className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition ${isDarkMode ? 'bg-gray-400' : 'bg-white'}`}></div>
                            </div>
                        </label>
                    </div>
                    <button onClick={handleProfileUpdate} className={`${primaryButtonClasses} mt-6`} disabled={updateProfile.isPending}>
                        {updateProfile.isPending ? 'Saving Preferences...' : 'Save Preferences'}
                    </button>
                </div>


                {/* Theme Section - Replaced existing ThemeSection with a dedicated card */}
                <div className={cardClasses}>
                    <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Theme Settings</h3>
                    <ThemeSection />
                </div>

                {/* Danger Zone */}
                <div className={`${cardClasses} border border-red-500 dark:border-red-700`}>
                    <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>Danger Zone</h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                        Proceed with caution. These actions are irreversible.
                    </p>
                    <button onClick={() => setIsDeleteAccountModalOpen(true)} className={`${destructiveButtonClasses} flex items-center justify-center space-x-2`}>
                        <MdDeleteForever size={20} className="mr-2" />
                        Delete Account
                    </button>
                </div>


                {/* Profile Edit Modal */}
                <Modal
                    isOpen={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                    title="Edit Profile"
                >
                    <form onSubmit={(e) => { e.preventDefault(); handleProfileUpdate(); }} className="space-y-4">
                        {localError && (
                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-600'}`}>
                                {localError}
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={newFirstName}
                                    onChange={(e) => setNewFirstName(e.target.value)}
                                    className={inputClasses}
                                    required
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={newLastName}
                                    onChange={(e) => setNewLastName(e.target.value)}
                                    className={inputClasses}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                Learning Language
                            </label>
                            {errorLanguages ? (
                                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-red-900/30 text-red-300 border border-red-800/50' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                                    {errorLanguages}
                                </div>
                            ) : (
                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                    className={inputClasses}
                                    required
                                    disabled={loadingLanguages}
                                >
                                    <option value="">Select a language</option>
                                    {availableLanguages?.map(lang => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setIsProfileModalOpen(false)}
                                className={secondaryButtonClasses}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={primaryButtonClasses}
                                disabled={updateProfile.isPending}
                            >
                                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* Password Change Modal */}
                <Modal
                    isOpen={isPasswordModalOpen}
                    onClose={() => setIsPasswordModalOpen(false)}
                    title="Change Password"
                >
                    <form onSubmit={(e) => { e.preventDefault(); handlePasswordUpdate(); }} className="space-y-4">
                        {localError && (
                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-600'}`}>
                                {localError}
                            </div>
                        )}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setIsPasswordModalOpen(false)}
                                className={secondaryButtonClasses}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={primaryButtonClasses}
                                disabled={resetPassword.isPending}
                            >
                                {resetPassword.isPending ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* Delete Account Confirmation Modal */}
                <Modal
                    isOpen={isDeleteAccountModalOpen}
                    onClose={() => setIsDeleteAccountModalOpen(false)}
                    title="Confirm Account Deletion"
                >
                    <div className="space-y-4">
                        <p className={`${isDarkMode ? 'text-gray-200' : 'text-white'}`}>
                            Are you sure you want to delete your account? This action is irreversible and all your data will be permanently lost.
                        </p>
                        {localError && (
                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-600'}`}>
                                {localError}
                            </div>
                        )}
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setIsDeleteAccountModalOpen(false)}
                                className={secondaryButtonClasses}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteAccount}
                                className={destructiveButtonClasses}
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default ProfilePage;