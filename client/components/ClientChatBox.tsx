"use client";

import { ChatContext } from "@/contexts/ChatContext";
import { useContext } from "react";
import ClientSendChatMessage from "./ClientSendChatMessage";
import dayjs from "dayjs";

// styling of chat bubble
const aiChatBubble =
  "bg-gray-200/50 text-left wrap-break-word whitespace-pre-line rounded-b-2xl rounded-tr-2xl px-4 py-2 mb-2 max-w-[70%]";
const userChatBubble =
  "bg-primary text-white wrap-break-word whitespace-pre-line rounded-b-2xl rounded-tl-2xl px-4 py-2 mb-2 max-w-[70%]";

const ClientChatBox = () => {
  const context = useContext(ChatContext);
  // handle if chat history is undefined
  if (!context)
    return (
      <div className="flex h-[450px] max-h-[500px] justify-center items-center">
        <div className="text-center text-red-600">
          Chat cannot be loaded. Please reload the page or try later.
        </div>
      </div>
    );

  const { messages, dispatch } = context;
  // console.log(messages);

  return (
    <div className="flex flex-col h-[450px] max-h-[500px]">
      {/* Chat bubbles */}
      <div className="flex-1 overflow-auto w-full">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${
              msg.role === "user" ? "justify-end" : "justify-start"
            } flex w-full mb-2`}
          >
            <div
              className={msg.role === "user" ? userChatBubble : aiChatBubble}
            >
              {msg.content}

              {msg.date && (
                <div className="text-xs text-gray-400 mt-2 text-right">
                  {dayjs(msg.date).format("HH:mm")}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chat input */}
      <ClientSendChatMessage dispatch={dispatch} />
    </div>
  );
};

export default ClientChatBox;
