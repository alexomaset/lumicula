import { db } from "@/app/db";
import { characters } from "@/app/db/schema";
import { authOptions } from "@/app/lib/auth";
import { uploadImage, deleteImage } from "@/app/lib/upload";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { type NextRequest } from "next/server";
import { CharacterSchema } from "@/app/db/schema";
import { z } from "zod";


export const dynamic = 'force-static';
// GET endpoint - Public access to single character
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const character = await db.query.characters.findFirst({
      where: eq(characters.id, id),
    });

    if (!character) {
      return Response.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    return Response.json(character);
  } catch (error) {
    console.error("Failed to fetch character:", error);
    return Response.json(
      { error: "Failed to fetch character" },
      { status: 500 }
    );
  }
}

// PUT endpoint - Protected, only for character owners
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = params;
    const existingCharacter = await db.query.characters.findFirst({
      where: and(
        eq(characters.id, id),
        eq(characters.userId, session.user.id)
      ),
    });

    if (!existingCharacter) {
      return Response.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const characterJson = formData.get("character") as string;
    const profileImage = formData.get("profileImage") as File | null;

    const characterData = JSON.parse(characterJson);
    const validatedData = CharacterSchema.parse(characterData);

    let imageUrl = characterData.profileImage;
    if (profileImage) {
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
        updatedAt: new Date(),
      })
      .where(and(
        eq(characters.id, id),
        eq(characters.userId, session.user.id)
      ))
      .returning();

    return Response.json(updatedCharacter[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Failed to update character:", error);
    return Response.json(
      { error: "Failed to update character" },
      { status: 500 }
    );
  }
}

// DELETE endpoint - Protected, only for character owners
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = params;
    const character = await db.query.characters.findFirst({
      where: and(
        eq(characters.id, id),
        eq(characters.userId, session.user.id)
      ),
    });

    if (!character) {
      return Response.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    if (character.profileImage) {
      await deleteImage(character.profileImage);
    }

    await db
      .delete(characters)
      .where(and(
        eq(characters.id, id),
        eq(characters.userId, session.user.id)
      ));

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete character:", error);
    return Response.json(
      { error: "Failed to delete character" },
      { status: 500 }
    );
  }
}