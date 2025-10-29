"use client";

import { createContext, ReactNode, useReducer } from "react";

// data type
export type MessageType = { role: "user" | "ai"; content: string; date: string };
export type ChatAction =
  | { type: "ADD_MESSAGE"; payload: MessageType }
  | { type: "RESET" };
type ChatContextType = {
  messages: MessageType[];
  dispatch: React.Dispatch<ChatAction>;
};

const chatReducer = (state: MessageType[], action: ChatAction) => {
  if (action.type === "ADD_MESSAGE") return [...state, action.payload];
  else if (action.type === "RESET") return [];
  else return state;
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
  const [messages, dispatch] = useReducer(chatReducer, initialMessages);

  return (
    <ChatContext.Provider value={{ messages, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
