import { useState, useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';
import type { ChatMessage, ChatSession } from '../types';

// Utility fonksiyonu: localStorage'dan oturumları yükle
const loadSessions = (): ChatSession[] => {
    const savedSessions = localStorage.getItem('chatSessions');
    return savedSessions ? JSON.parse(savedSessions) : [];
};

// Utility fonksiyonu: localStorage'a oturumları kaydet
const saveSessions = (sessions: ChatSession[]) => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
};

export const useChatSession = () => {
    const [sessions, setSessions] = useState<ChatSession[]>(loadSessions);
    const [currentId, setCurrentId] = useState<string | null>(null);

    // sessions state'i değiştiğinde oturumları localStorage'a kaydet
    useEffect(() => {
        saveSessions(sessions);
    }, [sessions]);

    // currentId değiştiğinde URL'yi güncelle (isteğe bağlı) - App.tsx veya MainLayout'ta yönetilebilir
    // useEffect(() => {
    //   if (currentId) {
    //     window.history.pushState(null, '', `/chat/${currentId}`);
    //   } else {
    //     window.history.pushState(null, '', '/chat');
    //   }
    // }, [currentId]);

    const createNewSession = () => {
        const newSession: ChatSession = {
            id: uuidv4(),
            title: 'Yeni Konuşma', // Varsayılan başlık
            messages: [],
        };
        // Yeni oturumu mevcut oturumların başına ekle (ChatGPT tarzı)
        setSessions([newSession, ...sessions]);
        setCurrentId(newSession.id);
    };

    const addMessage = (message: ChatMessage) => {
        if (!currentId) return;

        setSessions(sessions.map(session =>
            session.id === currentId
                ? { ...session, messages: [...session.messages, message] }
                : session
        ));
    };

    // Yeni fonksiyon: Sohbet başlığını güncelle
    const updateSessionTitle = (id: string, newTitle: string) => {
        setSessions(sessions.map(session =>
            session.id === id ? { ...session, title: newTitle } : session
        ));
    };

    const currentSession = sessions.find(session => session.id === currentId);

    return {
        sessions,
        currentSession,
        currentId,
        createNewSession,
        setCurrentId,
        addMessage,
        updateSessionTitle, // Yeni fonksiyonu döndürüyoruz
    };
};
