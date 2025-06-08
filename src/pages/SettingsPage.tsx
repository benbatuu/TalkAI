import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { MdOutlineLanguage, MdNotificationsActive, MdPrivacyTip, MdInfo } from "react-icons/md";
import LanguageSelector from '../components/language-selector';

const SettingsPage: React.FC = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
    const [emailNotifications, setEmailNotifications] = useState<boolean>(true); // New: Granular notification
    const [pushNotifications, setPushNotifications] = useState<boolean>(false); // New: Granular notification
    const [currency, setCurrency] = useState<string>('USD'); // New: General setting
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    useEffect(() => {
        const storedNotifications = localStorage.getItem('notificationsEnabled') === 'true';
        setNotificationsEnabled(storedNotifications);

        const storedEmailNotifications = localStorage.getItem('emailNotifications') === 'true';
        setEmailNotifications(storedEmailNotifications);

        const storedPushNotifications = localStorage.getItem('pushNotifications') === 'true';
        setPushNotifications(storedPushNotifications);

        const storedCurrency = localStorage.getItem('currency') || 'USD';
        setCurrency(storedCurrency);

        if (saveMessage) {
            const timer = setTimeout(() => setSaveMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [saveMessage]);

    const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Common styling classes for consistency
    const cardClasses = `p-6 rounded-xl shadow-md transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 text-gray-100 shadow-gray-700/50' : 'bg-white text-gray-800 shadow-gray-300/50'}`;
    const inputClasses = `w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'}`;
    const toggleCheckedClasses = 'translate-x-full bg-blue-600';
    const toggleUncheckedClasses = `${isDarkMode ? 'bg-gray-400' : 'bg-white'}`;
    const toggleTrackClasses = `block w-14 h-8 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`;
    const sectionHeaderClasses = `text-2xl font-bold mb-6 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`;
    const labelClasses = `text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;
    const subLabelClasses = `text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`;

    const handleSaveSettings = async (settingName: string, value: string | boolean) => {
        setIsSaving(true);
        setSaveMessage(null);
            try {
            // Simulate an API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Update local storage to persist static changes
            if (settingName === 'appLanguage') localStorage.setItem('appLanguage', value as string);
            else if (settingName === 'notificationsEnabled') localStorage.setItem('notificationsEnabled', String(value));
            else if (settingName === 'emailNotifications') localStorage.setItem('emailNotifications', String(value));
            else if (settingName === 'pushNotifications') localStorage.setItem('pushNotifications', String(value));
            else if (settingName === 'currency') localStorage.setItem('currency', value as string);
            else if (settingName === 'timeZone') localStorage.setItem('timeZone', value as string);
            else if (settingName === 'startPage') localStorage.setItem('startPage', value as string);

            setSaveMessage(t('settings.saveSuccess'));
        } catch (error) {
            setSaveMessage(t('settings.saveError'));
            console.error('Error saving settings:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={`h-screen p-4 ${isDarkMode ? 'bg-gray-600 text-gray-100' : 'bg-gray-200 text-gray-800'}`}>
            <div className="w-full h-full mx-auto space-y-8 overflow-y-auto custom-scrollbar pb-16 "> {/* Added custom-scrollbar for full-height scrolling */}
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {t('settings.title')}
                    </h1>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {t('settings.subtitle')}
                    </p>
                </div>

                {/* Save Message */}
                {saveMessage && (
                    <div className={`p-3 rounded-lg text-center font-medium ${saveMessage.includes('successfully') ? (isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700') : (isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700')}`}>
                        {saveMessage}
                    </div>
                )}

                {/* General Settings Card */}
                <div className={cardClasses}>
                    <h2 className={sectionHeaderClasses}>
                        <MdOutlineLanguage size={28} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                        {t('settings.generalSettings')}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
                        <LanguageSelector />

                        <div className="flex flex-col space-y-2 justify-between">
                            <label htmlFor="currency" className={labelClasses}>{t('settings.defaultCurrency')}</label>
                            <select
                                id="currency"
                                value={currency}
                                onChange={(e) => {
                                    setCurrency(e.target.value);
                                    handleSaveSettings('currency', e.target.value);
                                }}
                                className={`w-40 ${inputClasses}`}
                                disabled={isSaving}
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="TRY">TRY (₺)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between space-x-4">
                    <div className='flex flex-col w-2/3 h-full space-y-2'>
                        {/* Notification Settings Card */}
                        <div className={cardClasses}>
                            <h2 className={sectionHeaderClasses}>
                                <MdNotificationsActive size={28} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
                                {t('settings.notificationPreferences')}
                            </h2>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className={labelClasses}>{t('settings.enableAllNotifications')}</span>
                                    <label htmlFor="notificationsEnabled" className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            id="notificationsEnabled"
                                            className="sr-only peer"
                                            checked={notificationsEnabled}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                setNotificationsEnabled(isChecked);
                                                // Also toggle granular notifications if main toggle is off
                                                if (!isChecked) {
                                                    setEmailNotifications(false);
                                                    setPushNotifications(false);
                                                }
                                                handleSaveSettings('notificationsEnabled', isChecked);
                                            }}
                                            disabled={isSaving}
                                        />
                                        <div className={`${toggleTrackClasses} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-focus:ring-blue-800 dark:peer-checked:bg-blue-700`}></div>
                                        <div className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition ${notificationsEnabled ? toggleCheckedClasses : toggleUncheckedClasses}`}></div>
                                    </label>
                                </div>

                                {/* Granular Notification Settings - Conditional rendering */}
                                {notificationsEnabled && (
                                    <div className="ml-8 space-y-2 border-l-2 border-gray-200 pl-4 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <span className={subLabelClasses}>{t('settings.emailNotifications')}</span>
                                            <label htmlFor="emailNotifications" className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    id="emailNotifications"
                                                    className="sr-only peer"
                                                    checked={emailNotifications}
                                                    onChange={(e) => {
                                                        setEmailNotifications(e.target.checked);
                                                        handleSaveSettings('emailNotifications', e.target.checked);
                                                    }}
                                                    disabled={isSaving}
                                                />
                                                <div className={`${toggleTrackClasses} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-focus:ring-blue-800 dark:peer-checked:bg-blue-700`}></div>
                                                <div className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition ${emailNotifications ? toggleCheckedClasses : toggleUncheckedClasses}`}></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className={subLabelClasses}>{t('settings.pushNotifications')}</span>
                                            <label htmlFor="pushNotifications" className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    id="pushNotifications"
                                                    className="sr-only peer"
                                                    checked={pushNotifications}
                                                    onChange={(e) => {
                                                        setPushNotifications(e.target.checked);
                                                        handleSaveSettings('pushNotifications', e.target.checked);
                                                    }}
                                                    disabled={isSaving}
                                                />
                                                <div className={`${toggleTrackClasses} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-focus:ring-blue-800 dark:peer-checked:bg-blue-700`}></div>
                                                <div className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition ${pushNotifications ? toggleCheckedClasses : toggleUncheckedClasses}`}></div>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Data & Privacy Settings Card (New Section) */}
                        <div className={`${cardClasses} h-full`}>
                            <h2 className={sectionHeaderClasses}>
                                <MdPrivacyTip size={28} className={isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} />
                                {t('settings.dataAndPrivacy')}
                            </h2>
                            <div className="space-y-4">
                                <p className={subLabelClasses}>
                                    {t('settings.dataPrivacyDescription')}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => alert('Exporting data... (Static Action)')}
                                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    >
                                        {t('settings.exportData')}
                                    </button>
                                    <button
                                        onClick={() => alert('Clearing cache... (Static Action)')}
                                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    >
                                        {t('settings.clearCache')}
                                    </button>
                                </div>
                                <div className="mt-4">
                                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{t('settings.privacyPolicy')}</h3>
                                    <p className={subLabelClasses}>
                                        {t('settings.privacyPolicyDescription')}
                                    </p>
                                    <a href="/privacy-policy" className={`inline-flex items-center text-blue-500 hover:underline mt-2 ${isDarkMode ? 'text-blue-400' : ''}`}>
                                        {t('settings.readPrivacyPolicy')}
                                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-8h-4L14 3m0 0l2 2m-2-2L12 5m-2 0V3m0 0H7.5M12 18v-4m0 0h4m-4 0h-4M12 10V6m0 0h4m-4 0h-4M12 21a9 9 0 110-18 9 9 0 010 18z"></path></svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About & Help Card (New Section) */}
                    <div className={`${cardClasses} w-1/3 h-full`}>
                        <h2 className={sectionHeaderClasses}>
                            <MdInfo size={28} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                            {t('settings.aboutAndHelp')}
                        </h2>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-4">
                                <a
                                    href="/help"
                                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    {t('settings.helpCenter')}
                                </a>
                                <a
                                    href="/faq"
                                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    {t('settings.faq')}
                                </a>
                                <a
                                    href="/contact"
                                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    {t('settings.contactSupport')}
                                </a>
                                <a
                                    href="/terms"
                                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    {t('settings.termsOfService')}
                                </a>
                                <a href="/privacy-policy"
                                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    {t('settings.privacyPolicy')}
                                </a>
                            </div>
                            <p className={`${subLabelClasses} text-center pt-4`}>
                                {t('settings.version', { version: '1.0.0' })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
