"use client";

import { useChat } from "ai/react";
import { useRef, useEffect } from "react";

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      keepLastMessageOnError: true,
      body: { character: "etherealVisions" },
    });

  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4 space-y-4 bg-white pb-24">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            className={`p-3 sm:p-4 rounded-lg ${
              message.role === "user"
                ? "bg-blue-100 text-black ml-auto max-w-[85%] sm:max-w-md"
                : "bg-gray-100 text-black max-w-[85%] sm:max-w-md"
            }`}
          >
            <div className="font-bold mb-1">
              {message.role === "user" ? "You:" : "Ethereal Visions:"}
            </div>
            <div>{message.content}</div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 bg-white p-2 sm:p-4 border-t flex gap-2"
      >
        <input
          name="prompt"
          value={input}
          onChange={handleInputChange}
          className="flex-1 p-3 border rounded-lg text-base"
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-base"
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
