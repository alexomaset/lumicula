import { db } from "@/app/db";
import { characters } from "@/app/db/schema";
import { authOptions } from "@/app/lib/auth";
import { uploadImage } from "@/app/lib/upload";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const CoreTraitSchema = z.object({
  title: z.string(),
  description: z.string()
});

const PromptSchema = z.object({
  category: z.string(),
  prompt: z.string(),
  exampleResponse: z.string()
});

const DosAndDontsSchema = z.object({
  dos: z.array(z.string()),
  donts: z.array(z.string())
});

const CharacterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  profileImage: z.string().nullable().optional(),
  languageStyle: z.string().optional(),
  coreTraits: z.array(CoreTraitSchema),
  prompts: z.array(PromptSchema),
  dosAndDonts: DosAndDontsSchema
});

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userCharacters = await db.query.characters.findMany({
      where: eq(characters.userId, session.user.id),
      orderBy: characters.createdAt,
    });

    return NextResponse.json(userCharacters);
  } catch (error) {
    console.error('Failed to fetch characters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const characterJson = formData.get('character') as string;
    const profileImage = formData.get('profileImage') as File | null;
    
    const characterData = JSON.parse(characterJson);
    const validatedData = CharacterSchema.parse(characterData);
    
    let imageUrl = undefined;
    if (profileImage) {
      imageUrl = await uploadImage(profileImage);
    }

    const newCharacter = await db.insert(characters).values({
      ...validatedData,
      userId: session.user.id,
      profileImage: imageUrl,
    }).returning();

    return NextResponse.json(newCharacter[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Failed to create character:', error);
    return NextResponse.json(
      { error: 'Failed to create character' },
      { status: 500 }
    );
  }
}