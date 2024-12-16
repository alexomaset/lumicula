interface ChatMessageListProps {
  messages: {
    id: string;
    role: string;
    content: string;
  }[];
  lastMessageRef?: React.RefObject<HTMLDivElement>;
  characterName: string;
  isPreview?: boolean;
}

export default function ChatMessageList({
  messages,
  lastMessageRef,
  characterName,
  isPreview = false,
}: ChatMessageListProps) {
  // Add a type guard and filtering to ensure valid messages
  const validMessages = messages.filter(message => 
    message && 
    typeof message.id === 'string' && 
    typeof message.content === 'string' && 
    ['user', 'assistant'].includes(message.role)
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
          <div>
            {/* Add additional safety for content rendering */}
            {typeof message.content === 'string' 
              ? message.content 
              : JSON.stringify(message.content)}
          </div>
        </div>
      ))}
    </div>
  );
}