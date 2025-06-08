import React, { createContext, useContext, useState } from 'react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

interface Session {
    id: string;
    messages: Message[];
    title: string;
    createdAt: number;
}

interface ChatContextType {
    currentSession: Session | null;
    sessions: Session[];
    createSession: () => void;
    addMessage: (message: Omit<Message, 'timestamp'>) => void;
    clearSession: () => void;
    isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [currentSession, setCurrentSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const createSession = () => {
        const newSession: Session = {
            id: Math.random().toString(36).substring(7),
            messages: [],
            title: 'New Chat',
            createdAt: Date.now(),
        };
        setSessions(prev => [...prev, newSession]);
        setCurrentSession(newSession);
    };

    const addMessage = async (message: Omit<Message, 'timestamp'>) => {
        if (!currentSession) return;

        setIsLoading(true);
        try {
            const newMessage = { ...message, timestamp: Date.now() };
            const updatedSession = {
                ...currentSession,
                messages: [...currentSession.messages, newMessage],
            };

            setCurrentSession(updatedSession);
            setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
            
            // Simulate AI response delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Add AI response
            const aiMessage: Omit<Message, 'timestamp'> = {
                role: 'assistant',
                content: 'This is a sample response.',
            };
            const aiNewMessage = { ...aiMessage, timestamp: Date.now() };
            const finalSession = {
                ...updatedSession,
                messages: [...updatedSession.messages, aiNewMessage],
            };
            
            setCurrentSession(finalSession);
            setSessions(prev => prev.map(s => s.id === finalSession.id ? finalSession : s));
        } finally {
            setIsLoading(false);
        }
    };

    const clearSession = () => {
        if (!currentSession) return;
        setCurrentSession(null);
        setSessions(prev => prev.filter(s => s.id !== currentSession.id));
    };

    return (
        <ChatContext.Provider value={{ currentSession, sessions, createSession, addMessage, clearSession, isLoading }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
