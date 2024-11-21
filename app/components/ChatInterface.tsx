"use client";

import { useChat } from "ai/react";
import { useRef, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CharacterConfig } from "../lib/Characters";
import ChatMessageList from "./ChatMessageList";
import ChatInputForm from "./ChatInput";

interface ChatInterfaceProps {
  character: CharacterConfig;
}

export default function ChatInterface({ character }: ChatInterfaceProps) {
  const { data: session, status } = useSession();
  const sessionId = session?.user?.id || "anonymous";

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    id: `chat-${sessionId}-${character.id}`,
    keepLastMessageOnError: true,
    body: {
      character: character.id,
      sessionId: session?.user?.id || "anonymous", 
    },
    initialMessages: [{
      id: "system-message",
      role: "system",
      content:`Hello! I'm ${character.name}, ready to chat with you.`
    }]
  });

  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
   handleInputChange
  }, []);

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