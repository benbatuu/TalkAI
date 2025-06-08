import { useTheme } from '../context/ThemeContext'; // Assuming useTheme is available
import { BookOpenText, User, LayoutDashboard, Settings, MessageSquare } from 'lucide-react'; // More specific icons

// Define a type for your guide sections
interface GuideSection {
    id: number;
    title: string;
    content: string;
    icon: React.ElementType; // Lucide icon component
    keywords?: string[]; // Optional: for potential search/filtering
}

const GuidePage: React.FC = () => {
    const { theme } = useTheme(); // Get current theme context
    const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const guideSections: GuideSection[] = [
        {
            id: 1,
            title: 'Getting Started: Your First Steps',
            content: 'Welcome aboard! This guide is your compass to kickstart your journey. Begin by setting up your profile, choosing your preferred learning language, and exploring the main dashboard.',
            icon: User,
            keywords: ['setup', 'profile', 'language', 'onboarding'],
        },
        {
            id: 2,
            title: 'Mastering Language Practice',
            content: 'Dive into the practice section to hone your skills. Select from diverse topics and engaging modes. Your progress is automatically tracked, adapting to your learning pace.',
            icon: BookOpenText,
            keywords: ['practice', 'learn', 'topics', 'modes', 'skills'],
        },
        {
            id: 3,
            title: 'Visualizing Your Progress & Achievements',
            content: 'Track your growth on the Profile page. See detailed insights into practice time, completed sessions, and topic mastery. Intuitive graphs and progress bars vividly illustrate your learning journey.',
            icon: LayoutDashboard,
            keywords: ['progress', 'stats', 'achievements', 'profile', 'graphs'],
        },
        {
            id: 4,
            title: 'Personalizing Settings & Notifications',
            content: 'Tailor your app experience in the Settings page. Adjust preferences, manage notification alerts to stay updated on your learning milestones and messages.',
            icon: Settings,
            keywords: ['settings', 'customize', 'notifications', 'alerts', 'preferences'],
        },
        {
            id: 5,
            title: 'Connecting & Communicating',
            content: 'Engage with other learners or receive direct messages. Our messaging features keep you connected within the community, fostering a collaborative learning environment.',
            icon: MessageSquare,
            keywords: ['chat', 'messages', 'community', 'connect'],
        },
        {
            id: 6,
            title: 'Advanced Features & Tips',
            content: 'Unlock the full potential of our app with advanced features. Explore tips and tricks to enhance your learning experience, from shortcuts to hidden gems.',
            icon: BookOpenText, // Reusing the same icon for consistency
            keywords: ['advanced', 'features', 'tips', 'shortcuts'],
        },
        {
            id: 7,
            title: 'Frequently Asked Questions',
            content: 'Find answers to common questions about the app, from troubleshooting to best practices. This section helps you resolve issues quickly and efficiently.',
            icon: BookOpenText, // Reusing the same icon for consistency
            keywords: ['FAQ', 'help', 'troubleshooting', 'support'],
        },
        {
            id: 8,
            title: 'Feedback & Support',
            content: 'We value your feedback! Reach out to our support team for assistance or share your suggestions to help us improve the app.',
            icon: BookOpenText, // Reusing the same icon for consistency
            keywords: ['feedback', 'support', 'contact', 'improvement'],
        },
        {
            id: 9,
            title: 'Updates & New Features',
            content: 'Stay informed about the latest updates and new features. This section highlights recent changes and enhancements to the app, ensuring you never miss out.',
            icon: BookOpenText, // Reusing the same icon for consistency
            keywords: ['updates', 'new features', 'release notes', 'changelog'],
        }
    ];

    return (
        <div className={`h-screen p-4 w-full overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className={`mx-auto bg-white shadow-xl rounded-xl p-8 space-y-8 ${isDarkMode ? 'dark:bg-gray-800 dark:shadow-lg' : ''}`}>
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 animate-bounce-slow ${isDarkMode ? 'bg-gradient-to-r from-blue-700 to-purple-700' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}>
                        <BookOpenText className="w-8 h-8 text-white" />
                    </div>
                    <h1 className={`text-4xl font-extrabold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">Essential Guide</span>
                    </h1>
                    <p className={`mt-3 text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Everything you need to know to get the most out of our app.
                    </p>
                </div>

                {/* Guide Sections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {guideSections.map(section => {
                        const IconComponent = section.icon; // Get the icon component
                        return (
                            <div
                                key={section.id}
                                className={`group relative p-6 rounded-xl border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg
                                    ${isDarkMode
                                        ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:shadow-2xl'
                                        : 'bg-white border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {/* Icon */}
                                <div className={`mb-4 p-3 rounded-full inline-flex ${isDarkMode ? 'bg-blue-800/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                    <IconComponent className="w-7 h-7" />
                                </div>

                                {/* Title */}
                                <h2 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {section.title}
                                </h2>

                                {/* Content */}
                                <p className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {section.content}
                                </p>

                                {/* Optional: "Learn More" link/button (static for now) */}
                                <button
                                    onClick={() => alert(`"${section.title}" hakkında daha fazla bilgi... (Statik)`)}
                                    className={`mt-4 inline-flex items-center text-sm font-medium transition-colors group-hover:text-blue-600 group-hover:underline
                                        ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-700'}`}
                                >
                                    Learn More
                                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default GuidePage;