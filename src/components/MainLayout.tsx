import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import type { FC } from "react";
import { useAuth } from '../context/AuthContext';
import { ThemeSelector } from './theme-selector';
import { useState, useEffect } from 'react';
import type { ChatRoom } from '../types';
import { deleteChatRoom, createChatRoom } from '../services/chatService';
import { useMutation } from '@tanstack/react-query';

export const MainLayout: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loading, error, logout } = useAuth();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [hoveredChat, setHoveredChat] = useState<string | null>(null);
    const [chats, setChats] = useState<ChatRoom[]>([]);

    // Mutation for creating new chat room
    const { mutateAsync: createNewChat } = useMutation({
        mutationFn: createChatRoom,
        onSuccess: (data) => {
            navigate(`/${data.id}`);
        },
    });

    // Update chats when user changes or location changes
    useEffect(() => {
        if (user?.chatRooms) {
            setChats(user.chatRooms.map((room: ChatRoom) => ({
                ...room,
                isActive: location.pathname === `/${room.id}`
            })));
        }
    }, [user, location.pathname]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleCreateChat = async () => {
        try {
            await createNewChat();
        } catch (error) {
            console.error('Failed to create chat room:', error);
        }
    };

    const handleDeleteChat = async (chatID: string) => {
        try {
            await deleteChatRoom(chatID);
            setChats(prevChats => prevChats.filter(chat => chat.id !== chatID));
            if (location.pathname === `/${chatID}`) {
                navigate('/');
            }
        } catch (error) {
            console.error('Failed to delete chat:', error);
        }
    };

    // Close the menu when the location changes
    useEffect(() => {
        setIsNavOpen(false);
    }, [location.pathname]);

    // Filter chats based on search term
    const filteredChats = chats.filter(chat =>
        chat.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Icons for sidebar
    const IconChat = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
    );

    const IconFAQ = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9.247a4.76 4.76 0 011.995-1.564A4.76 4.76 0 0112 6.5c.749 0 1.485.156 2.164.459a4.762 4.762 0 011.995 1.564M8.228 9.247a4.759 4.759 0 00-1.995 1.564A4.761 4.761 0 005 12.5c0 .749.156 1.485.459 2.164a4.762 4.762 0 001.564 1.995m1.995-1.995a4.759 4.759 0 011.564-1.995A4.761 4.761 0 0112 10.5c.749 0 1.485.156 2.164.459a4.762 4.762 0 011.564 1.995m-1.995 1.995a4.759 4.759 0 00-1.564 1.995A4.761 4.761 0 0012 18.5c-.749 0-1.485-.156-2.164-.459a4.762 4.762 0 00-1.564-1.995m1.995 1.995a4.759 4.759 0 01-1.564-1.995A4.761 4.761 0 008 12.5c0-.749.156-1.485.459-2.164a4.762 4.762 0 00-1.564-1.995zm-2.083-2.083l7.82 7.82M15.772 8.728l-7.82 7.82" /></svg>
    );

    const IconUpgrade = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    );

    const IconNotifications = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a2 2 0 100 4 2 2 0 000-4zm-6 0a2 2 0 100 4 2 2 0 000-4z" /></svg>
    );

    const IconSetting = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    );

    return (
        <div className="flex flex-col h-screen p-8">
            <div className="flex flex-1 w-full mx-auto rounded-2xl shadow-xl overflow-hidden">
                <div className="w-64 bg-[#1F1F1F] text-white flex flex-col flex-shrink-0 space-y-2">
                    {/* Logo and Theme Section */}
                    <div className="flex flex-col space-y-4 p-4">
                        <div className="flex items-center h-16 cursor-pointer" onClick={() => navigate('/')}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18v-9" /></svg>
                            <span className="text-xl font-bold text-gray-100">OpenAI</span>
                        </div>
                        <ThemeSelector />
                    </div>

                    {/* Search Section */}
                    <div className="px-4">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search chats..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-700 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-gray-600 transition-all duration-200"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* New Chat Button */}
                    <div className="px-4">
                        <button
                            onClick={handleCreateChat}
                            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="ml-2">New Chat</span>
                        </button>
                    </div>

                    {/* Chat History Section */}
                    <div className="px-4 pt-2 border-b border-gray-700 flex-1 overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
                                <IconChat />
                                Chats
                            </h3>
                            <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded-full">
                                {filteredChats.length}
                            </span>
                        </div>

                        <div className="space-y-1">
                            {filteredChats.length > 0 ? (
                                filteredChats.map((chat) => (
                                    <div
                                        key={chat.id}
                                        className={`group relative rounded-lg transition-all duration-200 ${chat.isActive
                                            ? 'bg-green-600/20 border border-green-600/30'
                                            : 'hover:bg-gray-700/50'
                                            }`}
                                        onMouseEnter={() => setHoveredChat(chat.id)}
                                        onMouseLeave={() => setHoveredChat(null)}
                                    >
                                        <div className="flex items-center justify-between p-3">
                                            <Link
                                                to={`/${chat.id}`}
                                                className="flex-1 min-w-0"
                                            >
                                                <h4 className={`font-medium truncate text-sm ${chat.isActive ? 'text-green-100' : 'text-gray-300'}`}>
                                                    {chat.title}
                                                </h4>
                                                <p className={`text-xs mt-1 ${chat.isActive ? 'text-green-200/70' : 'text-gray-500'}`}>
                                                    {new Date(chat.createdAt).toLocaleDateString()}
                                                </p>
                                            </Link>

                                            <button
                                                className={`p-1.5 rounded-md transition-all duration-200 ${hoveredChat === chat.id ? 'opacity-100' : 'opacity-0'
                                                    } ${chat.isActive
                                                        ? 'hover:bg-red-600/50 text-red-300 hover:text-red-200'
                                                        : 'text-red-400 hover:bg-red-600/20 hover:text-red-300'
                                                    }`}
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    await handleDeleteChat(chat.id);
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center">
                                    <IconChat />
                                    <p className="text-gray-500 text-sm">
                                        {searchTerm ? 'No chats found' : 'No chats yet'}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {searchTerm ? 'Try a different search term' : 'Start a new conversation'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <div className="px-4">
                        <button
                            onClick={() => setIsNavOpen(!isNavOpen)}
                            className="w-full flex items-center justify-between p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-200"
                        >
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                <span className="ml-3">Menu</span>
                            </div>
                            {isNavOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            )}
                        </button>
                        {isNavOpen && (
                            <nav className="mt-2 space-y-1">
                                <Link to="/guide" className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-200">
                                    <IconFAQ />
                                    <span className="ml-3">Guide & FAQ</span>
                                </Link>
                                <Link to="/upgrade" className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-200">
                                    <IconUpgrade />
                                    <span className="ml-3">Upgrade</span>
                                </Link>
                                <Link to="/notifications" className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-200">
                                    <IconNotifications />
                                    <span className="ml-3">Notifications</span>
                                </Link>
                                <Link to="/settings" className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-200">
                                    <IconSetting />
                                    <span className="ml-3">Settings</span>
                                </Link>
                            </nav>
                        )}
                    </div>

                    {/* User Profile Section */}
                    <div className="p-4 flex-shrink-0 border-t border-gray-700">
                        <div className="flex items-center mb-4">
                            {loading ? (
                                <p className="text-sm font-semibold text-gray-400">Loading...</p>
                            ) : error ? (
                                <p className="text-sm font-semibold text-red-500">Error loading profile</p>
                            ) : user ? (
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="w-full flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-semibold overflow-hidden flex-shrink-0">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="ml-3 text-left">
                                        <p className="text-sm font-semibold text-gray-100">{user.firstname} {user.lastname}</p>
                                        <p className="text-xs text-gray-400">{user.email}</p>
                                    </div>
                                </button>
                            ) : (
                                <p className="text-sm font-semibold text-gray-400">Not logged in</p>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-start px-2 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="ml-3">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-[#2D2D2D] rounded-r-lg flex flex-col overflow-hidden">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
