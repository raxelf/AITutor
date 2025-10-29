"use client";

import { createContext, ReactNode, useState } from "react";

// data type
export type MessageType = { role: string; content: string };
type ChatContextType = {
  messages: MessageType[];
  addMessage: (role: string, content: string) => void;
};

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export const ChatProvider = ({
  children,
  initialMessages = [],
}: {
  children: ReactNode;
  initialMessages?: MessageType[];
}) => {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);

  const addMessage = (role: string, content: string) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
