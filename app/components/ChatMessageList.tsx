import React from "react";

interface MessageContent {
  text: string;
  type?: string;
  [key: string]: any;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'function' | 'data' | 'system' | 'tool'; // Make this more specific
  content: string | MessageContent;
}

interface ChatMessageListProps {
  messages: Message[];
  lastMessageRef?: React.RefObject<HTMLDivElement | null>;
  characterName: string;
  isPreview?: boolean;
}

const formatContent = (content: string | MessageContent): string => {
  // If content is a string, return it directly
  if (typeof content === "string") {
    return content;
  }

  // If content is an object with text property
  if (content && typeof content.text === "string") {
    return content.text;
  }

  // Fallback: try to stringify the content
  try {
    if (typeof content === "object") {
      return JSON.stringify(content);
    }
    return String(content);
  } catch {
    return "[Unable to display message content]";
  }
};

export default function ChatMessageList({
  messages,
  lastMessageRef,
  characterName,
  isPreview = false,
}: ChatMessageListProps) {
  // Debug logging
  console.log('Raw messages:', JSON.stringify(messages, null, 2));

  // Filter and validate messages
  const validMessages = messages.filter((message): message is Message => {
    if (!message || typeof message !== 'object') return false;
    if (typeof message.id !== 'string') return false;
    if (!['user', 'assistant'].includes(message.role)) return false;
    
    // Validate content
    const isValidContent = 
      typeof message.content === 'string' ||
      (typeof message.content === 'object' && message.content !== null &&
       ('text' in message.content && typeof message.content.text === 'string'));
    
    if (!isValidContent) {
      console.warn('Invalid message content:', message);
      return false;
    }
    
    return true;
  });

  // Debug logging for valid messages
  console.log('Valid messages:', validMessages);

  if (validMessages.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No messages to display
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${isPreview ? "opacity-75" : ""}`}>
      {validMessages.map((message, index) => {
        // Debug logging for each message being rendered
        console.log('Rendering message:', message);
        
        const formattedContent = formatContent(message.content);
        
        return (
          <div
            key={message.id}
            ref={index === validMessages.length - 1 ? lastMessageRef : null}
            className={`p-3 sm:p-4 rounded-lg ${
              message.role === "user"
                ? "bg-blue-100 text-black ml-auto max-w-[85%] sm:max-w-md"
                : "bg-gray-100 text-black max-w-[85%] sm:max-w-md"
            }`}
          >
            <div className="font-bold mb-1">
              {message.role === "user" ? "You:" : `${characterName}:`}
            </div>
            <div className="whitespace-pre-wrap">
              {formattedContent}
            </div>
          </div>
        );
      })}
    </div>
  );
}