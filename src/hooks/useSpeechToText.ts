declare global {
    interface Window {
        SpeechRecognition: any; // Veya daha spesifik bir tip
        webkitSpeechRecognition: any; // Veya daha spesifik bir tip
    }
}

import { useState, useEffect } from 'react';

export const useSpeechToText = () => {
    const [text, setText] = useState('');
    const [listening, setListening] = useState(false);
    const [error, setError] = useState('');

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    useEffect(() => {
        if (!recognition) {
            setError('Speech Recognition API is not available in this browser.');
            return;
        }

        recognition.continuous = true;
        recognition.interimResults = true; // Ara sonuçları al
        recognition.lang = 'en-US'; // İngilizce olarak ayarla, ihtiyaca göre değiştirilebilir

        recognition.onstart = () => {
            setListening(true);
            setError('');
        };

        recognition.onresult = (event: any) => {
            let interimText = '';
            let finalText = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalText += event.results[i][0].transcript;
                } else {
                    interimText += event.results[i][0].transcript;
                }
            }

            // Ara sonuçları da göstermek isterseniz burayı güncelleyebilirsiniz
            // Şu an sadece final metni alıyoruz
            if (finalText) {
                setText(prevText => prevText + finalText);
            }
        };

        recognition.onerror = (event: any) => {
            setError('Speech recognition error: ' + event.error);
            setListening(false);
        };

        recognition.onend = () => {
            setListening(false);
        };

        return () => {
            recognition.stop();
        };
    }, [recognition]);

    const startListening = () => {
        if (recognition && !listening) {
            setText(''); // Yeni dinleme başladığında metni temizle
            recognition.start();
        }
    };

    const stopListening = () => {
        if (recognition && listening) {
            recognition.stop();
        }
    };

    return { text, listening, startListening, stopListening, error };
};
