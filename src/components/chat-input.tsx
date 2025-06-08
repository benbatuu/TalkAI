import { useState, type FC } from "react";

interface Props {
    onSend: (text: string) => void;
    onMic: () => void;
    isRecording: boolean;
}

export const ChatInput: FC<Props> = ({ onSend, onMic, isRecording }) => {
    const [text, setText] = useState("");

    const handleSend = () => {
        if (text.trim()) {
            onSend(text.trim());
            setText("");
        }
    };

    return (
        <div className="flex gap-2 p-4 border-t bg-white">
            <input
                type="text"
                className="flex-1 border px-4 py-2 rounded-md"
                placeholder="Mesaj yaz..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
                onClick={onMic}
                className={`px-4 py-2 rounded-md font-semibold text-white ${isRecording ? "bg-red-500" : "bg-blue-500"
                    }`}
            >
                🎙
            </button>
            <button
                onClick={handleSend}
                className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
                Gönder
            </button>
        </div>
    );
};
