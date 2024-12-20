import { db } from "@/app/db";
import { characters } from "@/app/db/schema";
import { authOptions } from "@/app/lib/auth";
import { uploadImage, deleteImage } from "@/app/lib/upload";
import { eq, and } from "drizzle-orm";
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
  description: z.string().nullable().optional(),
  profileImage: z.string().optional(),
  languageStyle: z.string().optional(),
  coreTraits: z.array(CoreTraitSchema),
  prompts: z.array(PromptSchema),
  dosAndDonts: DosAndDontsSchema
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const character = await db.query.characters.findFirst({
      where: and(
        eq(characters.id, params.id),
        eq(characters.userId, session.user.id)
      ),
    });

    if (!character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(character);
  } catch (error) {
    console.error('Failed to fetch character:', error);
    return NextResponse.json(
      { error: 'Failed to fetch character' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // First, get the existing character to handle image updates
    const existingCharacter = await db.query.characters.findFirst({
      where: and(
        eq(characters.id, params.id),
        eq(characters.userId, session.user.id)
      ),
    });

    if (!existingCharacter) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const characterJson = formData.get('character') as string;
    const profileImage = formData.get('profileImage') as File | null;
    
    const characterData = JSON.parse(characterJson);
    const validatedData = CharacterSchema.parse(characterData);
    
    let imageUrl = characterData.profileImage;
    if (profileImage) {
      // Delete old image if it exists
      if (existingCharacter.profileImage) {
        await deleteImage(existingCharacter.profileImage);
      }
      imageUrl = await uploadImage(profileImage);
    }

    const updatedCharacter = await db
      .update(characters)
      .set({
        ...validatedData,
        profileImage: imageUrl,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(characters.id, params.id),
          eq(characters.userId, session.user.id)
        )
      )
      .returning();

    return NextResponse.json(updatedCharacter[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Failed to update character:', error);
    return NextResponse.json(
      { error: 'Failed to update character' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // First, get the character to delete its image if it exists
    const character = await db.query.characters.findFirst({
      where: and(
        eq(characters.id, params.id),
        eq(characters.userId, session.user.id)
      ),
    });

    if (!character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      );
    }

    // Delete the profile image if it exists
    if (character.profileImage) {
      await deleteImage(character.profileImage);
    }

    const deletedCharacter = await db
      .delete(characters)
      .where(
        and(
          eq(characters.id, params.id),
          eq(characters.userId, session.user.id)
        )
      )
      .returning();

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete character:', error);
    return NextResponse.json(
      { error: 'Failed to delete character' },
      { status: 500 }
    );
  }
}