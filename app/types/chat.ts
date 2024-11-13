interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }
  
  interface ChatSession {
    id: string
    characterId: string
    messages: ChatMessage[]
    createdAt: Date
    updatedAt: Date
  }