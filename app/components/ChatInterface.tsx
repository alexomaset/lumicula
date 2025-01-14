"use client";

import { useChat, Message } from "ai/react";
import { useRef, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import type { Character } from "../db/schema";
import ChatMessageList from "./ChatMessageList";
import ChatInputForm from "./ChatInput";
import PreviousConversations from "./ChatHistoryUi";

interface ChatHistoryItem {
  id: string;
  messages: Message[];
  userId: string;
  characterId: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string | MessageContent;
}

interface MessageContent {
  text?: string;
  [key: string]: any;
}

interface ChatHistoryItem {
  id: string;
  messages: Message[];
  userId: string;
  characterId: string;
}

interface ChatInterfaceProps {
  character: Character;
}

// Separate client component for previous conversations


export default function ChatInterface({ character }: ChatInterfaceProps) {
  const { data: session, status } = useSession();
  const sessionId = session?.user?.id || "anonymous";
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const getInitialMessage = useCallback((character: Character) => {
    const initialPrompt = character.prompts?.find(
      (prompt) =>
        prompt.category?.toLowerCase().includes("greeting") ||
        prompt.category?.toLowerCase().includes("initial")
    );
  
    // Create a shortened version of the description
    const shortDescription = character.description
      ? character.description.split('.')[0] // Take first sentence only
      : "";
  
    return (
      initialPrompt?.exampleResponse ||
      `Hi, I'm ${character.name}. ${shortDescription} How can I help you?`
    );
  }, []);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat({
    id: `chat-${sessionId}-${character.id}`,
    initialMessages: [
      {
        id: "system-message",
        role: "assistant",
        content: getInitialMessage(character),
      },
    ],
    keepLastMessageOnError: true,
    body: {
      characterId: character.id,
      sessionId,
    },
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  const fetchChatHistory = useCallback(async () => {
    if (!session?.user?.id) {
      setIsLoadingHistory(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/history?userId=${session.user.id}&characterId=${character.id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched chat history:", data);
      setChatHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
      setChatHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [session?.user?.id, character.id]);

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const loadChat = useCallback(
    (chat: ChatHistoryItem) => {
      const validMessages = chat.messages.map((msg) => ({
        ...msg,
        role: msg.role as Message["role"],
      }));
      setMessages(validMessages);
    },
    [setMessages]
  );

  if (isLoadingHistory) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading your chat history...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 pb-24">
          {!isLoadingHistory && (
            <PreviousConversations
              session={session}
              chatHistory={chatHistory || []} // Provide fallback empty array
              loadChat={loadChat}
              character={character}
            />
          )}

          {(!session?.user?.id || chatHistory.length === 0) &&
            messages.length <= 1 && (
              <div className="text-center text-gray-500 py-4">
                {session?.user?.id
                  ? "Start a new conversation below!"
                  : "Sign in to save your conversations"}
              </div>
            )}

          <ChatMessageList
            messages={messages.map((msg) => {
              const content =
                typeof msg.content === "string"
                  ? msg.content
                  : (msg.content as MessageContent).text ||
                    JSON.stringify(msg.content);
              return {
                ...msg,
                content,
              };
            })}
            lastMessageRef={lastMessageRef}
            characterName={character.name}
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <ChatInputForm
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
