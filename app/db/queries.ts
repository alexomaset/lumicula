import { db } from '.';
import { chat, type Chat, type NewChat } from './schema';
import { and, eq, InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { characters } from './schema'; // Drizzle schema
import { createId } from '@paralleldrive/cuid2';

type CoreTrait = {
  title: string;
  description: string;
};

type Prompt = {
  category: string;
  prompt: string;
  exampleResponse: string;
};

type DosAndDonts = {
  dos: string[];
  donts: string[];
};

interface NormalizedMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export type Character = InferSelectModel<typeof characters>;
export type NewCharacter = InferInsertModel<typeof characters>;

export const characterQueries = {
  // Create a new character
  create: async (userId: string, character: Omit<NewCharacter, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    return await db.insert(characters).values({
      id: createId(),
      userId,
      ...character,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Ensure proper typing for JSON fields
      coreTraits: character.coreTraits || [],
      prompts: character.prompts || [],
      dosAndDonts: character.dosAndDonts || { dos: [], donts: [] }
    }).returning();
  },

  // Get all public characters and user's private characters
  getAccessibleCharacters: async (userId?: string) => {
    if (userId) {
      // If user is logged in, get public characters + their private ones
      return await db
        .select()
        .from(characters)
        .where(eq(characters.userId, userId))
        .orderBy(characters.createdAt);
    } else {
      // If no user, get all characters (since we don't have isPublic flag)
      return await db
        .select()
        .from(characters)
        .orderBy(characters.createdAt);
    }
  },

  // Get a specific character by ID
  getById: async (id: string): Promise<Character | null> => {
    const result = await db
      .select()
      .from(characters)
      .where(eq(characters.id, id))
      .limit(1);
    
    return result[0] || null;
  },

  // Get all characters for a specific user
  getByUserId: async (userId: string): Promise<Character[]> => {
    return await db
      .select()
      .from(characters)
      .where(eq(characters.userId, userId))
      .orderBy(characters.createdAt);
  },

  // Update a character
  update: async (
    id: string, 
    userId: string, 
    updates: Partial<Omit<NewCharacter, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ) => {
    // Validate JSON fields before update
    const validatedUpdates = {
      ...updates,
      updatedAt: new Date(),
      ...(updates.coreTraits && { 
        coreTraits: validateCoreTraits(updates.coreTraits) 
      }),
      ...(updates.prompts && { 
        prompts: validatePrompts(updates.prompts) 
      }),
      ...(updates.dosAndDonts && { 
        dosAndDonts: validateDosAndDonts(updates.dosAndDonts) 
      })
    };

    return await db.update(characters)
      .set(validatedUpdates)
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

// Validation helpers
function validateCoreTraits(traits: unknown): CoreTrait[] {
  if (!Array.isArray(traits)) return [];
  
  return traits.filter((trait): trait is CoreTrait => 
    typeof trait === 'object' &&
    trait !== null &&
    typeof (trait as CoreTrait).title === 'string' &&
    typeof (trait as CoreTrait).description === 'string'
  );
}

function validatePrompts(prompts: unknown): Prompt[] {
  if (!Array.isArray(prompts)) return [];
  
  return prompts.filter((prompt): prompt is Prompt => 
    typeof prompt === 'object' &&
    prompt !== null &&
    typeof (prompt as Prompt).category === 'string' &&
    typeof (prompt as Prompt).prompt === 'string' &&
    typeof (prompt as Prompt).exampleResponse === 'string'
  );
}

function validateDosAndDonts(dosAndDonts: unknown): DosAndDonts {
  if (
    typeof dosAndDonts !== 'object' ||
    dosAndDonts === null ||
    !Array.isArray((dosAndDonts as DosAndDonts).dos) ||
    !Array.isArray((dosAndDonts as DosAndDonts).donts)
  ) {
    return { dos: [], donts: [] };
  }

  return {
    dos: (dosAndDonts as DosAndDonts).dos.filter(item => typeof item === 'string'),
    donts: (dosAndDonts as DosAndDonts).donts.filter(item => typeof item === 'string')
  };
}

// Helper to generate system message from character data
export const generateSystemMessage = (character: Character): string => {
  const traits = character.coreTraits
    ?.map(trait => `${trait.title}: ${trait.description}`)
    .join('\n') || '';

  const dos = character.dosAndDonts?.dos
    ?.map(item => `- Do: ${item}`)
    .join('\n') || '';

  const donts = character.dosAndDonts?.donts
    ?.map(item => `- Don't: ${item}`)
    .join('\n') || '';

  const prompts = character.prompts
    ?.map(p => `${p.category}:\n${p.prompt}\nExample: ${p.exampleResponse}`)
    .join('\n\n') || '';

  return `
Character: ${character.name}
${character.description || ''}

Core Traits:
${traits}

Guidelines:
${dos}
${donts}

Language Style:
${character.languageStyle || ''}

Example Interactions:
${prompts}
`.trim();
};
function normalizeMessage(message: any): NormalizedMessage {
  // Handle array format: [{text, type}]
  if (Array.isArray(message) && message[0]?.text && message[0]?.type) {
    return {
      role: message[0].type === 'human' ? 'user' : 'assistant',
      content: message[0].text,
      timestamp: new Date(message[0].timestamp || new Date())
    };
  }

  // Handle object format: {text, type}
  if (message.text && message.type) {
    return {
      role: message.type === 'human' ? 'user' : 'assistant',
      content: message.text,
      timestamp: new Date(message.timestamp || new Date())
    };
  }

  // Handle standard format: {role, content}
  if (message.role && message.content) {
    return {
      role: message.role,
      content: message.content,
      timestamp: new Date(message.timestamp || new Date())
    };
  }

  // Handle legacy or unknown formats
  console.warn('Unknown message format:', message);
  return {
    role: 'assistant',
    content: typeof message === 'string' ? message : JSON.stringify(message),
    timestamp: new Date()
  };
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
    const normalizedMessages = messages.map(normalizeMessage);

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

    // Normalize all messages in all chats
    return chats.map(chatItem => ({
      ...chatItem,
      messages: Array.isArray(chatItem.messages) 
        ? chatItem.messages.map(normalizeMessage)
        : []
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
    
    if (!foundChat) return null;

    // Normalize messages before returning
    return {
      ...foundChat,
      messages: Array.isArray(foundChat.messages)
        ? foundChat.messages.map(normalizeMessage)
        : []
    };
  } catch (error) {
    console.error('Error fetching chat:', error);
    throw new Error('Failed to fetch chat from database');
  }
}