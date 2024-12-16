import { Session } from "next-auth";

// Character Configuration Interface
export interface CharacterConfig {
  id: string;
  name: string;
  initialMessage: string;
  // Add any other character-specific properties
}

// Chat Message Interface (Standardized)
export interface ChatMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
}

// Chat History Item Interface
export interface ChatHistoryItem {
  id: string;
  characterId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Chat Interface Props
export interface ChatInterfaceProps {
  character: CharacterConfig;
}

// History Preview Props
export interface HistoryPreviewProps {
  chat: ChatHistoryItem;
  characterName: string;
  onLoadChat: (chat: ChatHistoryItem) => void;
}