import { db } from '.';
import { chat, type Chat, type NewChat } from './schema';
import { eq } from 'drizzle-orm';
import { characters, attachments } from './schema'; // Drizzle schema
import { v4 as uuidv4 } from 'uuid';
import { createId } from '@paralleldrive/cuid2';
import { put, del } from '@vercel/blob';
import { z } from 'zod';
interface ChatMessage {
   role: 'user' | 'assistant';
   content: string;
   timestamp?: number;
   // Add other relevant message properties
}

// Validation Schema
const fileAttachmentSchema = z.object({
  name: z.string().max(255),
  type: z.string(),
  size: z.number().max(10 * 1024 * 1024), // 10MB max file size
});

const characterSchema = z.object({
  name: z.string().min(1, "Character name is required").max(255, "Character name too long"),
  description: z.string().optional(),
});

export async function uploadCharacterAttachments(
  files: File[], 
  characterId: string, 
  userId: string
) {
  const uploadPromises = files.map(async (file) => {
    // Validate file
    try {
      fileAttachmentSchema.parse({
        name: file.name,
        type: file.type,
        size: file.size
      });
    } catch (validationError) {
      console.error('File validation failed:', validationError);
      throw new Error(`Invalid file: ${file.name}`);
    }

    // Generate unique filename
    const uniqueFileName = `characters/${userId}/${characterId}/${file.name}`;

    // Upload to Vercel Blob
    const blobResult = await put(uniqueFileName, file, {
      access: 'public',
      contentType: file.type, // Use contentType instead of handleContentType
    });

    // Create attachment record in database
    const [attachmentRecord] = await db
      .insert(attachments)
      .values({
        id: createId(),
        characterId,
        userId,
        name: file.name,
        type: file.type,
        size: file.size,
        url: blobResult.url,
        storageKey: blobResult.pathname
      })
      .returning();

    return attachmentRecord;
  });

  // Process all file uploads
  return Promise.all(uploadPromises);
}


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