"use client";

import { ChatContext } from "@/contexts/ChatContext";
import { useContext } from "react";

const ChatBox = () => {
  const context = useContext(ChatContext);
  // handle if context is undefined
  if (!context)
    return (
      <div className="text-center text-red-600">
        Chat unavailable. Please refresh or contact support.
      </div>
    );

  const { messages, dispatch } = context;
  // console.log(messages);

  return (
    <div className="flex flex-col h-[450px] max-h-[500px]">
      {/* Chat bubbles */}
      <div className="flex-1 overflow-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={
              msg.role === "user"
                ? "bg-primary text-white text-right rounded-2xl px-4 py-2 mb-2 max-w-[70%] self-end"
                : "bg-gray-200/50 text-left rounded-b-2xl rounded-tr-2xl px-4 py-2 mb-2 max-w-[70%] self-start"
            }
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Chat input */}
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          className="flex-1 border rounded-xl px-4 py-2 focus:outline-none"
          placeholder="Type your message..."
        />
        <button className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/75 cursor-pointer shrink-0">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
