import type { FC } from "react";
import type { ChatMessage } from "../types";


interface Props {
    messages: ChatMessage[];
}

export const ChatWindow: FC<Props> = ({ messages }) => {
    return (
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-white">
            {messages.map((msg, idx) => (
                <div
                    key={idx}
                    className={`max-w-xl px-4 py-2 rounded-lg ${msg.role === "user"
                        ? "self-end bg-green-100 text-right"
                        : "self-start bg-gray-100"
                        }`}
                >
                    <p>{msg.content}</p>
                </div>
            ))}
        </div>
    );
};
