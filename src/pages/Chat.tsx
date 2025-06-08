import { useEffect } from "react";
import { useChatSession } from "../hooks/useChatSessions";
import { useRecorder } from "../hooks/useRecorder";
import { useSpeechToText } from "../hooks/useSpeechToText";
import { sendMessage } from "../api/groqApi";
import { ChatWindow } from "../components/chat-window";
import { ChatInput } from "../components/chat-input";

const ChatPage = () => {
    const {
        currentSession,
        currentId,
        createNewSession,
        addMessage,
    } = useChatSession();

    const { } = useRecorder();
    const { text, listening, startListening } = useSpeechToText();

    const handleSend = async (text: string) => {
        if (!currentSession || !text.trim()) return;

        addMessage({ role: "user", content: text });

        try {
            const responseText = await sendMessage([
                ...currentSession.messages,
                { role: "user", content: text },
            ]);

            if (responseText) {
                addMessage({ role: "assistant", content: responseText });
            }
        } catch (error) {
            addMessage({
                role: "assistant",
                content: "API hatası: " + (error as Error).message,
            });
        }
    };

    const handleMic = async () => {
        if (!listening) {
            startListening();
        }
    };

    useEffect(() => {
        if (!currentId) {
            createNewSession();
        }
    }, [currentId, createNewSession]);

    useEffect(() => {
        if (!listening && text.trim()) {
            handleSend(text);
        }
    }, [listening, text, handleSend]);

    return (
        <div className="flex h-screen bg-zinc-100 text-zinc-900">
            <div className="flex flex-col flex-1">
                {currentSession ? (
                    <>
                        <ChatWindow messages={currentSession.messages} />
                        <ChatInput
                            onSend={handleSend}
                            onMic={handleMic}
                            isRecording={listening}
                        />
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-zinc-500">
                        Yeni bir konuşma başlatınız.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;