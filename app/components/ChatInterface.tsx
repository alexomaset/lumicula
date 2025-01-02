"use client";

import { useChat, Message } from "ai/react";
import { useRef, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import type { Character } from "../db/schema";
import ChatMessageList from "./ChatMessageList";
import ChatInputForm from "./ChatInput";

interface ChatHistoryItem {
  id: string;
  messages: Message[];
  userId: string;
  characterId: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string | MessageContent; // Allow content to be either string or MessageContent
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
function PreviousConversations({
  session,
  chatHistory,
  loadChat,
  character,
}: {
  session: any;
  chatHistory: ChatHistoryItem[];
  loadChat: (chat: ChatHistoryItem) => void;
  character: Character;
}) {
  // Add additional safety check for array
  if (!session?.user?.id || !Array.isArray(chatHistory) || chatHistory.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-lg font-semibold text-gray-700">
        Previous Conversations
      </h2>
      <div className="space-y-4">
        {chatHistory.map((chat) => (
          <button
            key={chat.id}
            onClick={() => loadChat(chat)}
            className="w-full text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="space-y-4">
              {chat.messages.slice(1, 3).map((msg, idx) => (
                <div
                  key={`${chat.id}-${msg.id}-${idx}`}
                  className={`flex items-start space-x-3 ${
                    msg.role === "assistant" ? "bg-gray-50" : ""
                  } rounded-lg p-4`}
                >
                  <div
                    className={`w-8 h-8 rounded-full ${
                      msg.role === "assistant" ? "bg-blue-500" : "bg-gray-500"
                    } flex items-center justify-center text-white font-medium`}
                  >
                    {msg.role === "assistant" ? character.name[0] : "U"}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="font-medium">
                      {msg.role === "assistant" ? character.name : "You"}
                    </div>
                    <div className="text-gray-700">{msg.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

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

    return (
      initialPrompt?.exampleResponse ||
      `Hello! I am ${character.name}. ${
        character.description || ""
      } How can I assist you today?`
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
            messages={messages.slice(1).map((msg) => {
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
