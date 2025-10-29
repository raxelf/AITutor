"use client";

import { doSendMessage } from "@/app/onboarding/action";
import { ChatAction } from "@/contexts/ChatContext";
import { Dispatch, useState } from "react";

const ClientSendChatMessage = ({
  dispatch,
  isAITyping,
  setIsAITyping,
}: {
  dispatch: Dispatch<ChatAction>;
  isAITyping: boolean;
  setIsAITyping: (value: boolean) => void;
}) => {
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    // Empty text validation
    if (!inputMessage.trim()) return;
    // user message
    dispatch({
      type: "ADD_MESSAGE",
      payload: {
        role: "user",
        content: inputMessage,
        date: new Date().toISOString(),
      },
    });
    setInputMessage("");

    // Ai reply
    try {
      setIsAITyping(true);

      const aiReply = await doSendMessage(inputMessage);

      dispatch({
        type: "ADD_MESSAGE",
        payload: {
          role: "ai",
          content: aiReply!,
          date: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error(err);

      dispatch({
        type: "ADD_MESSAGE",
        payload: {
          role: "ai",
          content: "There was an error contacting the AI service.",
          date: new Date().toISOString(),
        },
      });
    } finally {
      setIsAITyping(false);
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      <input
        type="text"
        className="flex-1 border rounded-2xl px-4 py-2 focus:outline-primary focus:ring-2 focus:ring-primary/30 bg-white/80 shadow-inner"
        placeholder="Type your message..."
        value={inputMessage}
        disabled={isAITyping}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSendMessage(e);
        }}
      />

      <button
        onClick={handleSendMessage}
        disabled={isAITyping}
        className="bg-primary text-white px-4 py-2 rounded-xl transition-transform duration-150 ease-in hover:bg-primary/80 focus:ring-2 focus:ring-primary/30"
      >
        Send
      </button>
    </div>
  );
};

export default ClientSendChatMessage;
