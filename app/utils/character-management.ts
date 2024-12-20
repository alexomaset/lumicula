// utils/character-management.ts
import { characters, type Character, type NewCharacter } from '@/app/db/schema';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export async function createCharacter(
  userId: string,
  characterData: Omit<NewCharacter, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Character> {
  const newCharacter = {
    id: createId(),
    userId,
    ...characterData,
  };

  const [character] = await db
    .insert(characters)
    .values(newCharacter)
    .returning();

  return character;
}

export async function getCharacterById(id: string): Promise<Character | null> {
  const [character] = await db
    .select()
    .from(characters)
    .where(eq(characters.id, id));
  
  return character || null;
}

export async function getAllCharacters(): Promise<Character[]> {
  return db.select().from(characters);
}

export function generateSystemMessage(character: Character) {
  return {
    role: 'system',
    content: `
name: "${character.name}",
description: "${character.description}",
    
coreTraits: ${JSON.stringify(character.coreTraits, null, 2)},

languageStyle: "${character.languageStyle}",

prompts: ${JSON.stringify(character.prompts, null, 2)},

dosAndDonts: ${JSON.stringify(character.dosAndDonts, null, 2)}
    `
  };
}