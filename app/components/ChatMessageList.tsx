import React from 'react';

interface MessageContent {
  text?: string;
  type?: string;
  [key: string]: any;
}

interface Message {
  id: string;
  role: string;
  content: string | MessageContent;
}

interface ChatMessageListProps {
  messages: Message[];
  lastMessageRef?: React.RefObject<HTMLDivElement>;
  characterName: string;
  isPreview?: boolean;
}

const formatContent = (content: string | MessageContent): string => {
  if (typeof content === 'string') {
    return content;
  }
  
  if (content.text) {
    return content.text;
  }
  
  return JSON.stringify(content);
};

export default function ChatMessageList({
  messages,
  lastMessageRef,
  characterName,
  isPreview = false,
}: ChatMessageListProps) {
  // Add a type guard and filtering to ensure valid messages
  const validMessages = messages.filter((message): message is Message =>
    message &&
    typeof message.id === 'string' &&
    ['user', 'assistant'].includes(message.role) &&
    (typeof message.content === 'string' || typeof message.content === 'object')
  );

  // Handle empty state
  if (validMessages.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No messages to display
      </div>
    );
  }
    
  return (
    <div className={`space-y-4 ${isPreview ? 'opacity-75' : ''}`}>
      {validMessages.map((message, index) => (
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
            {formatContent(message.content)}
          </div>
        </div>
      ))}
    </div>
  );
}