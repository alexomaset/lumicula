interface ChatMessageListProps {
  messages: {
    id: string;
    role: string;
    content: string;
  }[];
  lastMessageRef: React.RefObject<HTMLDivElement>;
  characterName: string;
}

export default function ChatMessageList({
  messages,
  lastMessageRef,
  characterName,
}: ChatMessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={message.id}
          ref={index === messages.length - 1 ? lastMessageRef : null}
          className={`p-3 sm:p-4 rounded-lg ${
            message.role === "user"
              ? "bg-blue-100 text-black ml-auto max-w-[85%] sm:max-w-md"
              : "bg-gray-100 text-black max-w-[85%] sm:max-w-md"
          }`}
        >
          <div className="font-bold mb-1">
            {message.role === "user" ? "You:" : `${characterName}:`}
          </div>
          <div>{message.content}</div>
        </div>
      ))}
    </div>
  );
}
