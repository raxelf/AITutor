"use client";

import { ChatContext } from "@/contexts/ChatContext";
import { useContext, useEffect, useRef, useState } from "react";
import ClientSendChatMessage from "./ClientSendChatMessage";
import dayjs from "dayjs";
import { ThreeDot } from "react-loading-indicators";
import Markdown from "react-markdown";

// styling of chat bubble
const aiChatBubble =
  "bg-gray-200/50 text-left wrap-break-word whitespace-pre-line rounded-b-2xl rounded-tr-2xl px-4 py-2 mb-2 max-w-[70%]";
const userChatBubble =
  "bg-primary text-white wrap-break-word whitespace-pre-line rounded-b-2xl rounded-tl-2xl px-4 py-2 mb-2 max-w-[70%]";

const ClientChatBox = () => {
  const [isAITyping, setIsAITyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const context = useContext(ChatContext);

  const messages = context?.messages;
  // console.log(messages);
  const dispatch = context?.dispatch;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log("spam");
  }, [messages, isAITyping]);

  // handle if chat history is undefined
  if (!context)
    return (
      <div className="flex h-[450px] max-h-[500px] justify-center items-center">
        <div className="text-center text-red-600">
          Chat cannot be loaded. Please reload the page or try later.
        </div>
      </div>
    );

  return (
    <div className="flex flex-col h-[450px] max-h-[500px]">
      {/* Chat bubbles */}
      <div className="flex-1 overflow-auto w-full">
        {messages!.map((msg, idx) => (
          <div
            key={idx}
            className={`${
              msg.role === "user" ? "justify-end" : "justify-start"
            } flex w-full mb-2`}
          >
            <div
              className={msg.role === "user" ? userChatBubble : aiChatBubble}
            >
              <Markdown>{msg.content}</Markdown>

              {msg.date && (
                <div className="text-xs text-gray-400 mt-2 text-right">
                  {dayjs(msg.date).format("HH:mm")}
                </div>
              )}
            </div>
          </div>
        ))}

        {isAITyping && (
          <div className="flex justify-start w-full mb-2">
            <div className={aiChatBubble}>
              <ThreeDot variant="pulsate" color="gray" size="small" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <ClientSendChatMessage
        dispatch={dispatch!}
        isAITyping={isAITyping}
        setIsAITyping={setIsAITyping}
      />
    </div>
  );
};

export default ClientChatBox;
