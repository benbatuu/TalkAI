import { Groq } from 'groq-sdk';
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY, // Vite için .env'de tanımlanmalı
    dangerouslyAllowBrowser: true, // Sadece güvenliyse kullan!
});

// Chat mesajı gönderme fonksiyonu
export async function sendMessage(messages: ChatCompletionMessageParam[]): Promise<string> {
    const chat = await groq.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: messages, // Mesaj dizisini doğrudan kullanıyoruz
        temperature: 0.8,
        top_p: 1,
        max_completion_tokens: 1024,
        stream: false, // Stream kullanmak istersen stream: true ile değiştirilebilir
    });

    const reply = chat.choices?.[0]?.message?.content || '';
    return reply;
}

// Ses dosyasını metne çevirme fonksiyonu (örnek - kendi transkripsiyon API'nı bağlaman gerekir)
export async function transcribeAudio(): Promise<string> {
    // Mock - gerçek backend olmadığından dolayı sahte metin döner
    return "This is a mock transcription from audio.";
}

