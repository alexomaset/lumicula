'server-only';
import {
  users,
  chat,
  User,
} from './schema';
import { db } from '.';
import {  eq, asc } from 'drizzle-orm';

export async function getUser(email: string): Promise<Array<User>> {
    try {
      return await db.select().from(users).where(eq(users.email, email));
    } catch (error) {
      console.error('Failed to get user from database');
      throw error;
    }
  }
  
