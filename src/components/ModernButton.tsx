import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ModernButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
}

const ModernButton: React.FC<ModernButtonProps> = ({
    children,
    onClick,
    type = "button",
    disabled = false,
    variant = "primary",
    className = "",
    ...rest
}) => (
    <button
        {...rest}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`w-full py-4 px-6 rounded-2xl font-semibold text-sm transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${className} ${variant === "primary"
            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white focus:ring-blue-500/25 shadow-lg hover:shadow-xl"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500/25"
            }`}
    >
        {children}
    </button>
);

export default ModernButton;
