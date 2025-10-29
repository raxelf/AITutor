"use client";

const ChatBox = () => {
  return (
    <div className="flex flex-col h-[450px] max-h-[500px]">
      {/* Chat bubbles */}
      

      {/* Chat input */}
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          className="flex-1 border rounded-xl px-4 py-2 focus:outline-none"
          placeholder="Type your message..."
        />
        <button className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/75 cursor-pointer">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
