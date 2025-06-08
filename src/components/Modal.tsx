// src/components/Modal.tsx
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    // İsteğe bağlı olarak, modalın genişliğini veya görünümünü özelleştirmek için
    panelClassName?: string;
    titleIcon?: React.ReactNode; // Başlık ikonunu eklemek için
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, panelClassName, titleIcon }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className={`relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-md dark:bg-gray-800/90 dark:border-gray-700/20 ${panelClassName || ''}`}>
                <div className="text-center mb-8">
                    {titleIcon && (
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25 dark:shadow-green-700/25">
                            {titleIcon}
                        </div>
                    )}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">{title}</h3>
                </div>
                {children}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label="Close modal"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Modal;