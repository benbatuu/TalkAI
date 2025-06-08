import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MainLayout } from './components/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ChatPage from './pages/ChatPage';
import GuidePage from './pages/GuidePage';
import NotificationsPage from './pages/NotificationsPage';
import UpgradePage from './pages/UpgradePage';
import { useAuth } from './context/AuthContext';
import { ChatProvider } from './providers/ChatProvider';

function App() {
    const { user, loading } = useAuth();
    const { t } = useTranslation();

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                    {t('common.loading')}
                </div>
            </div>
        );
    }

    return (
        <ChatProvider>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
                <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" replace />} />
                <Route path="/forgot-password" element={!user ? <ForgotPasswordPage /> : <Navigate to="/" replace />} />
                <Route path="/reset-password" element={!user ? <ResetPasswordPage /> : <Navigate to="/" replace />} />

                {/* Protected Routes */}
                <Route element={user ? <MainLayout /> : <Navigate to="/login" replace />}>
                    <Route path="/" element={<ChatPage />} />
                    <Route path="/:id" element={<ChatPage />} />
                    <Route path="/guide" element={<GuidePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/upgrade" element={<UpgradePage />} />
                </Route>

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </ChatProvider>
    );
}

export default App;
