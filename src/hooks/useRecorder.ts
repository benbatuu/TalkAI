import { useRef, useState } from "react";

export const useRecorder = () => {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const chunks = useRef<BlobPart[]>([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        mediaRecorderRef.current = new MediaRecorder(stream);
        chunks.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.current.push(event.data);
            }
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
    };

    const stopRecording = (): Promise<Blob> => {
        return new Promise((resolve) => {
            if (!mediaRecorderRef.current) return;

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunks.current, { type: "audio/webm" });
                setIsRecording(false);
                resolve(blob);
            };

            mediaRecorderRef.current.stop();
        });
    };

    return {
        isRecording,
        startRecording,
        stopRecording,
    };
};
