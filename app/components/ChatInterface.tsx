import { useChat, Message } from "ai/react";
import { useRef, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { CharacterConfig } from "../lib/Characters";
import ChatMessageList from "./ChatMessageList";
import ChatInputForm from "./ChatInput";

interface ChatHistoryItem {
  id: string;
  messages: Message[];
  userId: string;
  characterId: string;
}

interface ChatInterfaceProps {
  character: CharacterConfig;
}

export default function ChatInterface({ character }: ChatInterfaceProps) {
  const { data: session, status } = useSession();
  const sessionId = session?.user?.id || "anonymous";
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    append,
  } = useChat({
    id: `chat-${sessionId}-${character.id}`,
    keepLastMessageOnError: true,
    body: {
      character: character.id,
      sessionId: session?.user?.id || "anonymous",
    },
    initialMessages: []
  });

  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [streamingContent, setStreamingContent] = useState("");

  useEffect(() => {
    async function fetchChatHistory() {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/history?userId=${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            const characterChats = data.filter((chat: ChatHistoryItem) => 
              chat.characterId === character.id
            );
            setChatHistory(characterChats);
            
            if (characterChats.length === 0) {
              setMessages([{
                id: "system-message",
                role: "assistant",
                content: character.initialMessage
              }]);
            }
          }
        } catch (error) {
          console.error('Failed to fetch chat history:', error);
        }
      } else {
        setMessages([{
          id: "system-message",
          role: "assistant",
          content: character.initialMessage
        }]);
      }
      setIsLoadingHistory(false);
    }

    fetchChatHistory();
  }, [session?.user?.id, character.id, setMessages, character.initialMessage]);

  // Programmatically send a question to the AI
  const sendQuestion = useCallback((question: string) => {
    append({
      id: `user-${Date.now()}`,
      role: "user",
      content: question,
    });
  }, [append]);

  // Effect to start streaming the initial message on mount
  useEffect(() => {
    if (messages?.length < 1 && chatHistory.length < 1) {
      sendQuestion("Who are you and what do you do?");
    };
  }, [sendQuestion, messages?.length, chatHistory.length]);

  // Scroll to last message effect
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const loadChat = (chat: ChatHistoryItem) => {
    const validMessages = chat.messages.map(msg => ({
      ...msg,
      role: msg.role as Message['role']
    }));
    setMessages(validMessages);
  };

  if (isLoadingHistory) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading your chat history...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 pb-24">
          {/* Previous Conversations */}
          {session?.user?.id && chatHistory.length > 0 && (
            <div className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-gray-700">Previous Conversations</h2>
              {chatHistory.map((chat) => (
                <div key={chat.id} onClick={() => loadChat(chat)} className="space-y-4 cursor-pointer">
                  {chat.messages.slice(1, 3).map((msg, idx) => (
                    <div 
                      key={msg.id}
                      className={`flex items-start space-x-3 ${
                        msg.role === 'assistant' ? 'bg-gray-50' : ''
                      } rounded-lg p-4 hover:bg-gray-100 transition-colors`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                          {character.name[0]}
                        </div>
                      )}
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-medium">
                          U
                        </div>
                      )}
                      <div className="flex-1 space-y-1">
                        <div className="font-medium">
                          {msg.role === 'assistant' ? character.name : 'You'}
                        </div>
                        <div className="text-gray-700">{msg.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Current Conversation */}
          {(!session?.user?.id || chatHistory.length === 0) && messages.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              {session?.user?.id 
                ? "Start a new conversation below!"
                : "Sign in to save your conversations"}
            </div>
          )}
          
          <ChatMessageList
            messages={messages?.slice(1)}
            lastMessageRef={lastMessageRef}
            characterName={character.name}
          />
        </div>
      </div>

      {/* Chat Input */}
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