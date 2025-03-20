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
  const [isInputFocused, setIsInputFocused] = useState(false);
  console.log("🚀 ~ ChatInterface ~ isInputFocused:", isInputFocused)
  const [randomInitialMessage, setRandomInitialMessage] = useState('');
  const lastMessageRef = useRef<HTMLDivElement>(null);

  
  const getInitialMessage = useCallback((character: Character) => {
    const initialMessages = [
      "Welcome, seeker. How can we explore your path today?",
      "Hello! It's a pleasure to connect with you. What's on your mind right now?",
      "Greetings! I'm here to support your journey. What would you like to focus on today?",
      "Namaste! How can we enrich your spirit today?",
      "Blessings to you. What guidance are you seeking at this moment?",
      "Hi there! Let's uncover what the universe has in store for you today.",
      "Welcome! Feel free to share your thoughts and feelings; I'm here to listen.",
      "Hello, I'm glad you've reached out. What area of your life would you like to enhance?",
      "Peace be with you. How can we bring more balance to your life today?",
      "Good to see you! What steps can we take together on your wellness journey today?",
      "Warm greetings! What's in your heart that you'd like to discuss?",
      "Hello and welcome! Are you looking for guidance, healing, or both today?",
      "Hi! Let's make today a stepping stone to greater well-being. Where shall we begin?",
      "Welcome! What insights or guidance can I offer you today?",
      "Hello, dear soul. How can we nurture your spirit in our conversation today?",
      "Greetings of peace! What burdens can I help you lighten today?",
      "Hi! I'm here to help you find clarity. What questions do you carry with you today?",
      "Welcome! Every session is a step towards harmony. What's your first step today?",
      "It's a joy to meet you! How can we start our journey toward your personal improvement?",
      "Salutations! What wisdom can we seek together in this beautiful moment?"
    ];
    // use a random message from our collection
    const randomMessage = initialMessages[Math.floor(Math.random() * initialMessages.length)];
    return `${randomMessage}`;
  }, []);

  useEffect(() => {
    if (!randomInitialMessage) {
      setRandomInitialMessage(getInitialMessage(character));
    }
  }, [character, getInitialMessage, randomInitialMessage]);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    // error,
  } = useChat({
    id: `chat-${sessionId}-${character.id}`,
    initialMessages: [
      {
        id: "system-message",
        role: "assistant",
        content: randomInitialMessage,
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
      <div className={`flex-1 overflow-y-auto`}>
        <div className={`p-4 pb-24`}>
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
            isInputFocused={isInputFocused}
          />
        </div>
      </div>

      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t p-4`}>
        <ChatInputForm
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          onFocusChange={setIsInputFocused}
        />
      </div>
    </div>
  );
}
