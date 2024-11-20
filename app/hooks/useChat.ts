"use client";

import { useState, useEffect } from 'react';

interface Chat {
  id: string;
  messages: any[];
  createdAt: string;
  userId: string;
  characterId?: string;
}

export function useChats(userId: string | undefined) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Only fetch if userId exists
    if (!userId) {
      setIsLoading(false);
      return;
    }

    async function fetchChats() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/history?userId=${userId}`);
        
        if (!response.ok) {
          // Handle non-200 responses
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch chats');
        }
        
        const data = await response.json();
        setChats(data);
      } catch (err) {
        // Properly handle and set error
        setError(err instanceof Error ? err : new Error('Failed to fetch chats'));
        console.error('Chats fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchChats();
  }, [userId]);

  return { 
    data: chats, 
    isLoading, 
    error 
  };
}