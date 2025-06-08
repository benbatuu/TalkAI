import { useState, useMemo } from 'react';
import { Bell, Check, X, Clock, Gift, MessageCircle, BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Assuming useTheme is available for theme context

type NotificationType = 'message' | 'reminder' | 'achievement' | 'update' | 'system';
type Notification = {
    id: number;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: NotificationType;
    icon: React.ElementType;
};

const NotificationsPage: React.FC = () => {
    const { theme } = useTheme(); // Tema bağlamını buradan al
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 1,
            title: 'Yeni Mesajınız Var',
            message: 'Ali size bir mesaj gönderdi.',
            time: '2 saat önce',
            read: false,
            type: 'message',
            icon: MessageCircle
        },
        {
            id: 2,
            title: 'Ders Hatırlatması',
            message: 'Bugün saat 19:00\'da İngilizce dersiniz var.',
            time: '1 gün önce',
            read: true,
            type: 'reminder',
            icon: BookOpen
        },
        {
            id: 3,
            title: 'Ödül Kazandınız!',
            message: 'Tebrikler! 500 pratik dakikasına ulaştınız.',
            time: '3 gün önce',
            read: true,
            type: 'achievement',
            icon: Gift
        },
        {
            id: 4,
            title: 'Uygulama Güncellemesi',
            message: 'Uygulamamızın yeni sürümü çıktı. Hemen güncelleyin!',
            time: '1 hafta önce',
            read: false,
            type: 'update',
            icon: Bell
        },
        {
            id: 5,
            title: 'Sistem Bakımı Duyurusu',
            message: 'Planlı bakım nedeniyle hizmetlerde kısa süreli kesinti yaşanabilir.',
            time: '2 hafta önce',
            read: false,
            type: 'system',
            icon: Clock
        },
        {
            id: 6,
            title: 'Yeni Arkadaşlık İsteği',
            message: 'Mehmet size arkadaşlık isteği gönderdi.',
            time: '1 ay önce',
            read: true,
            type: 'message',
            icon: MessageCircle
        },
    ]);

    const [filterType, setFilterType] = useState<'all' | 'unread' | 'read'>('all');

    const markAsRead = (id: number) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
    };

    const deleteNotification = (id: number) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

    const filteredNotifications = useMemo(() => {
        if (filterType === 'unread') {
            return notifications.filter(n => !n.read);
        }
        if (filterType === 'read') {
            return notifications.filter(n => n.read);
        }
        return notifications;
    }, [notifications, filterType]);

    // Tema durumuna göre koyu modu kontrol et
    const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const getTypeStyles = (type: NotificationType) => {
        const styles: Record<NotificationType, string> = {
            message: isDarkMode
                ? 'from-blue-800/60 to-blue-900/60 border-blue-700 text-blue-300'
                : 'from-blue-100 to-blue-200 border-blue-300 text-blue-700',
            reminder: isDarkMode
                ? 'from-amber-800/60 to-amber-900/60 border-amber-700 text-amber-300'
                : 'from-amber-100 to-amber-200 border-amber-300 text-amber-700',
            achievement: isDarkMode
                ? 'from-emerald-800/60 to-emerald-900/60 border-emerald-700 text-emerald-300'
                : 'from-emerald-100 to-emerald-200 border-emerald-300 text-emerald-700',
            update: isDarkMode
                ? 'from-purple-800/60 to-purple-900/60 border-purple-700 text-purple-300'
                : 'from-purple-100 to-purple-200 border-purple-300 text-purple-700',
            system: isDarkMode
                ? 'from-gray-700/60 to-gray-800/60 border-gray-600 text-gray-300'
                : 'from-gray-100 to-gray-200 border-gray-300 text-gray-700'
        };
        return styles[type] || styles.system;
    };

    // Temaya göre dinamik genel sınıflar
    const baseBgClass = `bg-white shadow-xl rounded-xl ${isDarkMode ? 'dark:bg-gray-800 dark:shadow-lg' : ''}`;
    const headerBgClass = `bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-white/20 ${isDarkMode ? 'dark:bg-gray-700/80 dark:border-gray-600/20 dark:shadow-none' : ''}`;

    return (
        <div className={`h-screen p-4 w-full overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className={`mx-auto h-full ${baseBgClass} p-8 flex flex-col gap-8`}>
                {/* Header */}
                <div className={headerBgClass}>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Bell className={`w-9 h-9 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                {unreadCount > 0 && (
                                    <span className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce border-2 ${isDarkMode ? 'border-gray-700' : 'border-white'}`}>
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h1 className={`text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Bildirimler</h1>
                                <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {unreadCount > 0
                                        ? `${unreadCount} okunmamış bildiriminiz var`
                                        : 'Tüm bildirimleriniz güncel ve okundu.'
                                    }
                                </p>
                            </div>
                        </div>

                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className={`px-5 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${isDarkMode ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'}`}
                                aria-label="Tümünü Okundu İşaretle"
                            >
                                <Check className="w-5 h-5" />
                                Tümünü Okundu İşaretle
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter and Actions Section */}
                <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl shadow-inner ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex space-x-2 w-full sm:w-auto justify-center">
                        <button
                            onClick={() => setFilterType('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'all'
                                ? `${isDarkMode ? 'bg-blue-700 text-white shadow-md' : 'bg-blue-600 text-white shadow-md'}`
                                : `${isDarkMode ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                                }`}
                        >
                            Tümü ({notifications.length})
                        </button>
                        <button
                            onClick={() => setFilterType('unread')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'unread'
                                ? `${isDarkMode ? 'bg-blue-700 text-white shadow-md' : 'bg-blue-600 text-white shadow-md'}`
                                : `${isDarkMode ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                                }`}
                        >
                            Okunmamış ({unreadCount})
                        </button>
                        <button
                            onClick={() => setFilterType('read')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'read'
                                ? `${isDarkMode ? 'bg-blue-700 text-white shadow-md' : 'bg-blue-600 text-white shadow-md'}`
                                : `${isDarkMode ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                                }`}
                        >
                            Okundu ({notifications.length - unreadCount})
                        </button>
                    </div>
                </div>


                {/* Notifications List */}
                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                    {filteredNotifications.length === 0 ? (
                        <div className={`backdrop-blur-sm rounded-2xl p-12 text-center border ${isDarkMode ? 'bg-gray-700/80 border-gray-600/20' : 'bg-white/80 border-white/20'}`}>
                            <Bell className={`w-20 h-20 mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-300'}`} />
                            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {filterType === 'unread' ? 'Hiç okunmamış bildirim yok!' :
                                    filterType === 'read' ? 'Henüz okunan bildirim yok.' :
                                        'Henüz hiç bildirim yok.'}
                            </h3>
                            <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Yeni bildirimler burada görünecek.</p>
                        </div>
                    ) : (
                        filteredNotifications.map(notification => {
                            const IconComponent = notification.icon;
                            return (
                                <div
                                    key={notification.id}
                                    className={`group relative backdrop-blur-sm rounded-2xl p-6 mt-2 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isDarkMode ? 'dark:bg-gray-700/80 dark:hover:shadow-2xl dark:hover:-translate-y-1' : 'bg-white/80'}`}
                                >
                                    {/* Unread indicator */}
                                    {!notification.read && (
                                        <div className={`absolute top-4 right-4 w-3.5 h-3.5 bg-blue-500 rounded-full animate-pulse ${isDarkMode ? 'dark:bg-blue-400' : ''}`}></div>
                                    )}

                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className={`p-3 rounded-full bg-gradient-to-br ${getTypeStyles(notification.type)} flex-shrink-0 shadow-md`}>
                                            <IconComponent className="w-6 h-6" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <h3 className={`text-xl font-bold transition-colors ${notification.read ? `${isDarkMode ? 'text-gray-400' : 'text-gray-600'}` : `${isDarkMode ? 'text-white' : 'text-gray-800'}`}`}>
                                                    {notification.title}
                                                </h3>

                                                <div className={`flex items-center gap-2 text-sm flex-shrink-0 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    <Clock className="w-4 h-4" />
                                                    {notification.time}
                                                </div>
                                            </div>

                                            <p className={`leading-relaxed ${notification.read ? `font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}` : `font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}`}>
                                                {notification.message}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action buttons (only visible on hover or always for unread) */}
                                    <div className={`flex items-center justify-end gap-2 mt-4 transition-opacity duration-200 ${!notification.read ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                        {!notification.read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className={`px-4 py-2 rounded-xl transition-colors duration-200 text-sm font-medium flex items-center gap-1 shadow-sm ${isDarkMode ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                                                aria-label={`Bildirim "${notification.title}" okundu olarak işaretle`}
                                            >
                                                <Check className="w-4 h-4" />
                                                Okundu İşaretle
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(notification.id)}
                                            className={`px-4 py-2 rounded-xl transition-colors duration-200 text-sm font-medium flex items-center gap-1 shadow-sm ${isDarkMode ? 'bg-red-900/30 text-red-300 hover:bg-red-900/50' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                            aria-label={`Bildirim "${notification.title}" sil`}
                                        >
                                            <X className="w-4 h-4" />
                                            Sil
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;