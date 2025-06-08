import { Check, Star, Zap, Crown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Assuming useTheme is available

// Define TypeScript interfaces for better type safety
interface PlanFeature {
    text: string;
    available: boolean; // Added for features that might be conditionally available
}

interface Plan {
    id: number;
    name: string;
    price: string;
    duration: string;
    features: (string | PlanFeature)[]; // Can be string or detailed object
    description: string;
    icon: React.ReactNode;
    popular: boolean;
    savings?: string;
    highlightColor?: string; // New: for custom highlight
}

const UpgradePage: React.FC = () => {
    const { theme } = useTheme(); // Get current theme context

    const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const plans: Plan[] = [
        {
            id: 1,
            name: 'Basic',
            price: '$14.99',
            duration: '/month',
            features: [
                '50 prompt per day',
                'Basic AI chat capabilities',
                'Message history for 30 days',
                'Basic file uploads (up to 5MB)',
                'Email support',
            ],
            description: 'Perfect for individual users.',
            icon: <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
            popular: false,
            highlightColor: 'blue', // Custom color for basic
        },
        {
            id: 2,
            name: 'Pro',
            price: '$119.99',
            duration: '/year',
            features: [
                '100 messages per day',
                'Advanced AI capabilities',
                'Message history for 60 days',
                'Large file uploads (up to 10MB)',
                'Voice chat enabled',
                { text: 'Priority feature requests', available: false }, // Example of conditionally available feature
            ],
            description: 'Best value for power users.',
            icon: <Star className="w-6 h-6 text-yellow-500 dark:text-yellow-300" />,
            popular: true,
            savings: 'Save 33%',
            highlightColor: 'green', // Custom color for pro
        },
        {
            id: 3,
            name: 'Enterprise',
            price: '$499.99',
            duration: '/lifetime',
            features: [
                'Unlimited messages',
                'Premium AI capabilities',
                'Permanent message history',
                'Extra large files (up to 50MB)',
                'Priority 24/7 support',
                'Voice chat enabled',
                'Early access to new features',
                'Dedicated account manager', // Added a new premium feature
            ],
            description: 'Ultimate access with no limits.',
            icon: <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
            popular: false, // Changed popular to false for Enterprise, as Lifetime is often niche
            highlightColor: 'purple', // Custom color for enterprise
        },
    ];

    // Helper function to get dynamic colors based on theme and plan highlight
    const getHighlightClasses = (color: string | undefined, isLifetime: boolean) => {
        if (isLifetime) {
            // Lifetime plan uses its own distinct gradient and text colors
            return {
                cardBg: 'bg-gradient-to-br from-purple-800 to-indigo-900 text-white shadow-xl', // Stronger gradient
                checkColor: 'text-green-300',
                priceColor: 'text-white',
                durationColor: 'text-purple-200',
                descriptionColor: 'text-purple-100',
                featureColor: 'text-white',
                buttonBg: 'bg-white text-purple-900 hover:bg-gray-100 dark:bg-gray-200 dark:text-purple-800 dark:hover:bg-gray-300',
                innerBadgeBg: 'bg-white/20 dark:bg-white/10',
                innerBadgeText: 'text-yellow-300 dark:text-yellow-400',
            };
        }

        // Other plans
        if (isDarkMode) {
            switch (color) {
                case 'blue': return {
                    cardBg: 'bg-gray-700 text-white ring-blue-500/50 hover:ring-blue-500 dark:ring-blue-400/50 dark:hover:ring-blue-400', // Darker background
                    checkColor: 'text-green-400',
                    priceColor: 'text-white',
                    durationColor: 'text-gray-400',
                    descriptionColor: 'text-gray-300',
                    featureColor: 'text-gray-300',
                    buttonBg: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
                };
                case 'green': return {
                    cardBg: 'bg-gray-700 text-white ring-emerald-500/50 hover:ring-emerald-500 dark:ring-emerald-400/50 dark:hover:ring-emerald-400', // Darker background
                    checkColor: 'text-green-400',
                    priceColor: 'text-white',
                    durationColor: 'text-gray-400',
                    descriptionColor: 'text-gray-300',
                    featureColor: 'text-gray-300',
                    buttonBg: 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600',
                };
                case 'purple': return {
                    cardBg: 'bg-gray-700 text-white ring-purple-500/50 hover:ring-purple-500 dark:ring-purple-400/50 dark:hover:ring-purple-400', // Darker background
                    checkColor: 'text-green-400',
                    priceColor: 'text-white',
                    durationColor: 'text-gray-400',
                    descriptionColor: 'text-gray-300',
                    featureColor: 'text-gray-300',
                    buttonBg: 'bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600',
                };
                default: return {
                    cardBg: 'bg-gray-700 text-white',
                    checkColor: 'text-green-400',
                    priceColor: 'text-white',
                    durationColor: 'text-gray-400',
                    descriptionColor: 'text-gray-300',
                    featureColor: 'text-gray-300',
                    buttonBg: 'bg-gray-600 text-white hover:bg-gray-500',
                };
            }
        } else {
            // Light mode
            switch (color) {
                case 'blue': return {
                    cardBg: 'bg-white text-gray-900 ring-blue-200 hover:ring-blue-500',
                    checkColor: 'text-green-500',
                    priceColor: 'text-gray-900',
                    durationColor: 'text-gray-500',
                    descriptionColor: 'text-gray-600',
                    featureColor: 'text-gray-700',
                    buttonBg: 'bg-blue-600 text-white hover:bg-blue-700',
                };
                case 'green': return {
                    cardBg: 'bg-white text-gray-900 ring-emerald-200 hover:ring-emerald-500',
                    checkColor: 'text-green-500',
                    priceColor: 'text-gray-900',
                    durationColor: 'text-gray-500',
                    descriptionColor: 'text-gray-600',
                    featureColor: 'text-gray-700',
                    buttonBg: 'bg-emerald-600 text-white hover:bg-emerald-700',
                };
                case 'purple': return {
                    cardBg: 'bg-white text-gray-900 ring-purple-200 hover:ring-purple-500',
                    checkColor: 'text-green-500',
                    priceColor: 'text-gray-900',
                    durationColor: 'text-gray-500',
                    descriptionColor: 'text-gray-600',
                    featureColor: 'text-gray-700',
                    buttonBg: 'bg-purple-600 text-white hover:bg-purple-700',
                };
                default: return {
                    cardBg: 'bg-white text-gray-900',
                    checkColor: 'text-green-500',
                    priceColor: 'text-gray-900',
                    durationColor: 'text-gray-500',
                    descriptionColor: 'text-gray-600',
                    featureColor: 'text-gray-700',
                    buttonBg: 'bg-gray-900 text-white hover:bg-gray-800',
                };
            }
        }
    };


    return (
        <div className={`h-screen p-4 w-full overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className={`mx-auto bg-white shadow-xl rounded-xl w-full ${isDarkMode ? 'dark:bg-gray-800 dark:shadow-lg' : ''}`}>
                <div className="container mx-auto px-4 py-16 md:py-12">
                    {/* Header Section */}
                    <div className="text-center mb-12 md:mb-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 animate-pulse-light dark:from-blue-700 dark:to-purple-700">
                            <Crown className="w-8 h-8 text-white" />
                        </div>
                        <h1 className={`text-5xl font-extrabold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Unlock Your Potential with <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">Premium Features</span>
                        </h1>
                        <p className={`mt-4 text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Choose the plan that best fits your needs and elevate your experience.
                        </p>
                    </div>

                    {/* Plans Grid */}
                    <div className="max-w-7xl mx-auto py-8">
                        <div className="grid gap-8 md:gap-10 grid-cols-1 lg:grid-cols-3 items-stretch">
                            {plans.map(plan => {
                                const highlight = getHighlightClasses(plan.highlightColor, plan.id === 3); // Get dynamic classes

                                return (
                                    <div key={plan.id}
                                        className={`relative rounded-3xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-2 group
                                            ${plan.popular && plan.id !== 3 && 'ring-4 ring-offset-4 ring-blue-400/50 dark:ring-blue-600/50 ring-offset-gray-100 dark:ring-offset-gray-900'}
                                            ${highlight.cardBg}
                                            ${plan.id === 3 ? 'overflow-hidden' : ''}
                                            `}
                                    >
                                        {/* Optional Background Pattern for Lifetime Plan (subtle) */}
                                        {plan.id === 3 && (
                                            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                                                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" fill="currentColor">
                                                    <pattern id="pattern-circles" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                                                        <circle cx="5" cy="5" r="1" />
                                                    </pattern>
                                                    <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
                                                </svg>
                                            </div>
                                        )}

                                        <div className="relative z-10 flex flex-col h-full"> {/* Ensures content is above pattern */}
                                            {/* Popular Badge */}
                                            {plan.popular && plan.id !== 3 && (
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                                                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-md dark:from-blue-600 dark:to-purple-600">
                                                        <Star className="w-4 h-4 fill-current" />
                                                        Most Popular
                                                    </div>
                                                </div>
                                            )}
                                            {/* Savings Badge */}
                                            {plan.savings && plan.id !== 3 && (
                                                <div className="absolute top-4 right-4">
                                                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm dark:bg-green-900/30 dark:text-green-300">
                                                        {plan.savings}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Plan Header */}
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className={`p-3 rounded-xl shadow-sm ${plan.id === 3 ? highlight.innerBadgeBg : `bg-${plan.highlightColor}-100 dark:bg-${plan.highlightColor}-900/30`}`}>
                                                    {plan.icon} {/* Using the icon directly now */}
                                                </div>
                                                <h2 className={`text-3xl font-bold ${highlight.priceColor}`}>{plan.name}</h2>
                                            </div>

                                            {/* Price */}
                                            <div className="mb-6">
                                                <div className="flex items-baseline gap-2">
                                                    <span className={`text-5xl font-extrabold ${highlight.priceColor}`}>{plan.price}</span>
                                                    <span className={`text-lg ${highlight.durationColor}`}>{plan.duration}</span>
                                                </div>
                                                <p className={`mt-2 text-base ${highlight.descriptionColor}`}>{plan.description}</p>
                                            </div>

                                            {/* Features */}
                                            <ul className="space-y-4 mb-8 flex-grow"> {/* flex-grow to push button to bottom */}
                                                {plan.features.map((feature, index) => {
                                                    const featureText = typeof feature === 'string' ? feature : feature.text;
                                                    const isAvailable = typeof feature === 'string' ? true : feature.available;
                                                    return (
                                                        <li key={index} className={`flex items-start gap-3 ${isAvailable ? '' : 'opacity-60 grayscale'}`}>
                                                            <Check className={`w-5 h-5 ${highlight.checkColor} mt-0.5 flex-shrink-0`} />
                                                            <span className={`${highlight.featureColor}`}>{featureText}</span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>

                                            {/* CTA Button */}
                                            <button className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 ${highlight.buttonBg} ${isDarkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}`}>
                                                {plan.id === 3 ? 'Get Lifetime Access' : 'Get Started'}
                                            </button>
                                            {plan.id === 3 && (
                                                <div className={`${highlight.innerBadgeBg} rounded-2xl p-4 mt-6 text-center shadow-inner`}>
                                                    <div className={`text-2xl font-bold ${highlight.innerBadgeText} mb-1`}>Best Value</div>
                                                    <div className={`text-sm ${highlight.durationColor}`}>One-time payment, lifetime access</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpgradePage;