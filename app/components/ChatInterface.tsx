"use client";

import { useChat } from "ai/react";
import { useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CharacterConfig } from "../lib/Characters";
import ChatMessageList from "./ChatMessageList";
import ChatInputForm from "./ChatInput";
// Define the character configuration type

// Props for the ChatInterface component
interface ChatInterfaceProps {
  character: CharacterConfig;
}

export default function ChatInterface({ character }: ChatInterfaceProps) {
  const { data: session } = useSession();
  const sessionId = session?.user?.id || "anonymous";

  const {
    messages,
    input,
    handleInputChange,
    append,
    handleSubmit,
    isLoading,
  } = useChat({
    keepLastMessageOnError: true,
    body: {
      character: character.id,
      sessionId,
    },
    initialMessages: [{
      id: "system-message",
      role: "assistant",
      content: character.initialMessage 
    }]
  });

  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  // Scroll to last message effect
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
      <ChatMessageList
        messages={messages}
        lastMessageRef={lastMessageRef}
        characterName={character.name}
      />
      <ChatInputForm
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
