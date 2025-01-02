import { db } from "@/app/db";
import { characters, CharacterSchema } from "@/app/db/schema";
import { authOptions } from "@/app/lib/auth";
import { uploadImage } from "@/app/lib/upload";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";



export async function GET() {
  try {
    const allCharacters = await db.query.characters.findMany({
      orderBy: characters.createdAt,
    });

    return NextResponse.json(allCharacters);
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