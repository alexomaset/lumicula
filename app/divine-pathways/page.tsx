"use client";

import { useChat } from "ai/react";

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    keepLastMessageOnError: true,
    body: { character: "divinePathways" },
  });

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4 bg-white pb-24">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg ${
              message.role === "user"
                ? "bg-blue-100 text-black ml-auto max-w-md"
                : "bg-gray-100 text-black max-w-md"
            }`}
          >
            <div className="font-bold mb-1">
              {message.role === "user" ? "You:" : "Divine Pathways:"}
            </div>
            <div>{message.content}</div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t flex gap-2"
      >
        <input
          name="prompt"
          value={input}
          onChange={handleInputChange}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}

