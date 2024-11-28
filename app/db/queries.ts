import { db } from '.';
import { chat, NewUser, type Chat, type NewChat } from './schema';
import { eq } from 'drizzle-orm';
import { users, type User } from './schema';
import { compare, hash } from 'bcrypt';

interface ChatMessage {
   role: 'user' | 'assistant';
   content: string;
   timestamp?: number;
   // Add other relevant message properties
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
    // First check if chat exists
    const existingChat = await db.select().from(chat).where(eq(chat.id, id));
    
    if (existingChat.length > 0) {
      // Update existing chat
      const [updatedChat] = await db
        .update(chat)
        .set({
          messages,
          updatedAt: new Date(),
          characterId
        })
        .where(eq(chat.id, id))
        .returning();
      
      return updatedChat;
    } else {
      // Insert new chat
      const [newChat] = await db
        .insert(chat)
        .values({
          id,
          userId,
          messages,
          characterId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      
      return newChat;
    }
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
    
    return chats;
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


export async function createUser(userData: NewUser): Promise<User> {
  try {
      const hashedPassword = await hash(userData.password, 10);
      const [newUser] = await db
          .insert(users)
          .values({ ...userData, password: hashedPassword, createdAt: new Date() })
          .returning();

      return newUser;
  } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
  }
}
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    return user || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
}

export async function verifyUser(email: string, password: string): Promise<User | null> {
  try {
    const user = await getUserByEmail(email);
    
    if (!user) return null;

    const isValidPassword = await compare(password, user.password);
    
    return isValidPassword ? user : null;
  } catch (error) {
    console.error('Error verifying user:', error);
    throw new Error('User verification failed');
  }
}