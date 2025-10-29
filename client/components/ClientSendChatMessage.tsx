"use client";

import { ChatAction } from "@/contexts/ChatContext";
import { Dispatch, useState } from "react";

const ClientSendChatMessage = ({
  dispatch,
}: {
  dispatch: Dispatch<ChatAction>;
}) => {
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    dispatch({
      type: "ADD_MESSAGE",
      payload: { role: "user", content: inputMessage },
    });

    setInputMessage("");
  };

  return (
    <div className="flex gap-2 mt-4">
      <input
        type="text"
        className="flex-1 border rounded-xl px-4 py-2 focus:outline-none"
        placeholder="Type your message..."
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSendMessage(e);
        }}
      />

      <button
        onClick={handleSendMessage}
        className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/75 cursor-pointer shrink-0"
      >
        Send
      </button>
    </div>
  );
};

export default ClientSendChatMessage;
