// src/api/chat.ts
import axios from "axios";
import type { ChatMessage } from "../types";

export const chatWithGPT = async (messages: ChatMessage[]): Promise<string> => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo", // veya "gpt-4"
                messages,
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        const err = error as import("axios").AxiosError;
        console.error("Chat API hatası:", err.response?.data || err.message);
        throw new Error("Chat yanıtı alınamadı.");
    }
};
