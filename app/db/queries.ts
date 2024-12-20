import { db } from '.';
import { chat, NewCharacter, type Chat, type NewChat } from './schema';
import { and, eq } from 'drizzle-orm';
import { characters, Character } from './schema'; // Drizzle schema


export const characterQueries = {
  // Create a new character
  create: async (userId: string, character: NewCharacter) => {
    return await db.insert(characters).values({
      ...character,
      userId
    }).returning();
  },

  // Get all characters for a user
  getByUserId: async (userId: string) => {
    return await db.select().from(characters)
      .where(eq(characters.userId, userId))
      .orderBy(characters.createdAt);
  },

  // Get a specific character by ID
  getById: async (id: string, userId: string) => {
    const result = await db.select()
      .from(characters)
      .where(and(
        eq(characters.id, id),
        eq(characters.userId, userId)
      ))
      .limit(1);
    
    return result[0] || null;
  },

  // Update a character
  update: async (id: string, userId: string, updates: Partial<NewCharacter>) => {
    return await db.update(characters)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(and(
        eq(characters.id, id),
        eq(characters.userId, userId)
      ))
      .returning();
  },

  // Delete a character
  delete: async (id: string, userId: string) => {
    return await db.delete(characters)
      .where(and(
        eq(characters.id, id),
        eq(characters.userId, userId)
      ))
      .returning();
  }
};

export async function saveChat({
  id,
  messages,
  userId,
  characterId,
}: {
  id: string;
  messages: any[];
  userId: string;
  characterId?: string;
}): Promise<Chat> {
  try {
    // Normalize messages to ensure consistent structure
    const normalizedMessages = messages.map(msg => {
      // If message is in the [{text, type}] array format
      if (Array.isArray(msg) && msg[0]?.text && msg[0]?.type) {
        return {
          role: msg[0].type === 'human' ? 'user' : 'assistant',
          content: msg[0].text,
          timestamp: new Date()
        };
      }

      // If message is already in {text, type} object format
      if (msg.text && msg.type) {
        return {
          role: msg.type === 'human' ? 'user' : 'assistant',
          content: msg.text,
          timestamp: new Date()
        };
      }

      // If message is in the standard {role, content} format
      if (msg.role && msg.content) {
        return msg;
      }

      // Fallback for unexpected formats
      console.error('Unexpected message format:', msg);
      return {
        role: 'assistant',
        content: JSON.stringify(msg),
        timestamp: new Date()
      };
    });

    const [savedChat] = await db
      .insert(chat)
      .values({
        id,
        userId,
        messages: normalizedMessages,
        characterId,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    return savedChat;
  } catch (error) {
    console.error('Error saving chat:', error);
    throw new Error('Failed to save chat to database');
  }
}
export async function getChatsByUserId(userId: string): Promise<Chat[]> {
  try {
    const chats = await db
      .select()
      .from(chat)
      .where(eq(chat.userId, userId))
      .orderBy(chat.updatedAt);

    // Normalize messages to ensure consistent format
    return chats.map(chatItem => ({
      ...chatItem,
      messages: chatItem.messages.map(msg => {
        // Handle [{text, type}] array format
        if (Array.isArray(msg) && msg[0]?.text && msg[0]?.type) {
          return {
            role: msg[0].type === 'human' ? 'user' : 'assistant',
            content: msg[0].text,
            timestamp: new Date()
          };
        }
        // Handle {text, type} object format
        if (msg.text && msg.type) {
          return {
            role: msg.type === 'human' ? 'user' : 'assistant',
            content: msg.text,
            timestamp: new Date()
          };
        }
        // Return as-is if already in correct format
        return msg;
      })
    }));
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw new Error('Failed to fetch chats from database');
  }
}

export async function getChatById(chatId: string): Promise<Chat | null> {
  try {
    const [foundChat] = await db
      .select()
      .from(chat)
      .where(eq(chat.id, chatId));
    
    return foundChat || null;
  } catch (error) {
    console.error('Error fetching chat:', error);
    throw new Error('Failed to fetch chat from database');
  }
}