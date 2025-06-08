import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { SendHorizonal, Bot, User2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { createChatViaText, getSingleChatRoom, createChatRoom } from '../services/chatService';
import { useParams, useNavigate } from 'react-router-dom';
import type { Message, ChatRoom } from '../types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const ChatPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const { user } = useUser();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    // Query for fetching chat room messages
    const { data: chatRoom, isLoading: isLoadingMessages } = useQuery<ChatRoom>({
        queryKey: ['chatRoom', id],
        queryFn: () => getSingleChatRoom(id!),
        enabled: !!id,
    });

    // Mutation for creating a new chat room
    const { mutateAsync: createNewChatRoom } = useMutation({
        mutationFn: createChatRoom,
        onSuccess: (data) => {
            navigate(`/${data.id}`);
        },
    });

    // Mutation for sending messages
    const { mutateAsync: sendMessage, isPending: isSending } = useMutation({
        mutationFn: async (message: string) => {
            if (!id) {
                // If no room exists, create one first
                const newRoom = await createNewChatRoom();
                const response = await createChatViaText(message, newRoom.id);
                return response;
            } else {
                return createChatViaText(message, id);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chatRoom', id] });
        },
    });

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatRoom?.messages]);

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = inputRef.current;
        if (input && input.value.trim()) {
            const message = input.value.trim();
            input.value = '';
            await sendMessage(message);
            input.focus();
        }
    };

    // Theme-based styling
    const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const baseBg = isDarkMode ? 'bg-gray-900' : 'bg-gray-100';
    const chatBubbleBgUser = isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white';
    const chatBubbleBgAI = isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800';
    const inputBg = isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300';
    const buttonBg = isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600';

    // Parse assistant message
    const parseAssistantMessage = (message: string) => {
        try {
            const parsed = JSON.parse(message);
            return parsed.generalComment || parsed.message || message;
        } catch {
            return message;
        }
    };

    const isLoading = isLoadingMessages || isSending;
    const messages = chatRoom?.messages || [];

    return (
        <div className={`flex flex-col h-screen w-full ${baseBg} p-4`}>
            <div className={`flex-1 overflow-y-auto p-4 md:p-6 rounded-lg shadow-inner ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'}`}>
                {messages.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-full text-center text-gray-500 dark:text-gray-400">
                        <Bot className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-600" />
                        <p className="text-xl font-semibold mb-2">{t('chat.welcomeTitle')}</p>
                        <p className="text-sm">{t('chat.welcomeSubtitle')}</p>
                    </div>
                ) : (
                    messages.map((message: Message) => (
                        <div
                            key={message.id}
                            className={`flex items-end mb-6 gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.role !== 'user' && (
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-purple-600' : 'bg-purple-500'} text-white`}>
                                    <Bot className="w-5 h-5" />
                                </div>
                            )}
                            <div
                                className={`max-w-[70%] p-4 rounded-2xl break-words ${message.role === 'user' 
                                    ? `${chatBubbleBgUser} rounded-br-none` 
                                    : `${chatBubbleBgAI} rounded-bl-none shadow-md`}`}
                            >
                                {message.role === 'assistant' 
                                    ? parseAssistantMessage(message.message)
                                    : message.message
                                }
                            </div>
                            {message.role === 'user' && (
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-green-600' : 'bg-green-500'} text-white`}>
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="User Avatar" className="w-7 h-7 rounded-full" />
                                    ) : (
                                        <User2 className="w-5 h-5" />
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input
                        ref={inputRef}
                        type="text"
                        className={`flex-1 p-3 rounded-xl shadow-sm ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder={isLoading ? t('chat.loading') : t('chat.placeholder')}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className={`px-5 py-3 rounded-xl text-white font-semibold transition-colors ${buttonBg} disabled:opacity-50`}
                        disabled={isLoading}
                    >
                        <SendHorizonal className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
