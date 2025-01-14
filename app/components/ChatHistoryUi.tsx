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

interface ChatInterfaceProps {
  character: Character;
}

export default function PreviousConversations({
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
    if (
      !session?.user?.id ||
      !Array.isArray(chatHistory) ||
      chatHistory.length === 0
    )
      return null;
  
    return (
      <div className="space-y-4 mb-8">
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