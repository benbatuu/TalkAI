// src/api/whisper.ts
import axios, { AxiosError } from "axios";

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model", "whisper-1");
    formData.append("response_format", "text");

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    try {
        const response = await axios.post<string>(
            "https://api.openai.com/v1/audio/transcriptions",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data; // string döner çünkü response_format: "text"
    } catch (error) {
        const err = error as AxiosError;

        console.error("Whisper API hatası:", err.response?.data || err.message);
        throw new Error("Ses dönüştürülürken bir hata oluştu.");
    }
};
