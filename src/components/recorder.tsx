// src/components/Recorder.tsx
import { useEffect, useRef, useState } from "react";
import { recordAudio } from "../utils/recordAudio";
import type { RecorderProps } from "../types";


export function Recorder({ onRecordingComplete }: RecorderProps) {
    const recorderRef = useRef<Awaited<ReturnType<typeof recordAudio>> | null>(null);
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        // Hazırda kaydedici oluştur
        recordAudio().then((recorder) => {
            recorderRef.current = recorder;
        });
    }, []);

    const handleStart = () => {
        if (!recorderRef.current) return;
        recorderRef.current.start();
        setIsRecording(true);
    };

    const handleStop = async () => {
        if (!recorderRef.current) return;
        const audioBlob = await recorderRef.current.stop();
        setIsRecording(false);
        onRecordingComplete(audioBlob);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <button
                onClick={isRecording ? handleStop : handleStart}
                className={`px-6 py-3 rounded text-white font-bold transition ${isRecording ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                    }`}
            >
                {isRecording ? "⏹️ Durdur" : "🎙️ Konuş"}
            </button>
        </div>
    );
}
